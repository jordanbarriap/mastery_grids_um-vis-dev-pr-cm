//Topics which have activities that should not be recommended
var non_recommended_topics = ["Table Creation", "Table Deletion and Alteration", "Key Constraints", "Tuple Insertion", "Tuple Deletion", "Tuple Update", "General Constraints", "Derived Relations and Views"];

// ------------------------------------------------------------------------------------------------------
/**
 * Recommendation approach: Remedial
 * Generate a list of recommended content list based on problematic concepts and  
 * knowledge level infered for kcs
 */
function generateRemedialRecommendations(data_topics_acts_kcs, kc_levels, kc_topic_weights, weight_kcs, weight_sr){
	var proficiency_threshold = .66;
	var filtered_kcs = kc_topic_weights.map(function(d){return d.id});
	var filtered_kc_levels = {};
	for (var i=0; i<filtered_kcs.length;i++){
		var kc_id = filtered_kcs[i];
		if (kc_levels.hasOwnProperty(kc_id)) {
            filtered_kc_levels[kc_id] = kc_levels[kc_id];
        }
	}
  
	kc_levels = filtered_kc_levels;
	calculateKcDifficultyScores(kc_levels, weight_kcs, weight_sr);
	var recommendations = [];
	var topics = data_topics_acts_kcs;
	var n_topics = topics.length;

	//If at least one of the kcs have a level > .5, we generate the recommendations
	var condition_to_generate_recommendations = false;

	for(var i=1; i<n_topics;i++){
		var topic = topics[i];
		var topic_name = topic.name;
		var resources = Object.keys(topic.activities);
		var n_resources = resources.length;
		for (var j=0; j<n_resources;j++){
			var resource_id = resources[j];
			var activities = topic.activities[resource_id];
			var n_activities = activities.length;
			for (var k=0;k<n_activities;k++){
				var activity = activities[k];
				var kcs = activity["kcs"];
				var rec_score = 0;
				var weights_sum = 0;
				var helpful_kcs = 0;
				var problematic_kcs = 0;
				var slip_kcs = 0;

				//Total number of concepts needed for solving the problem / understanding the example
				var total_kcs = 0;

				for (var l=0;l<kcs.length;l++){
					var kc_id = kcs[l];
					if (kc_id in kc_levels){
						var kc_diff = kc_levels[kc_id]["diff"];
						if(kc_diff>=0){
							total_kcs ++;
							var kc_weight = topic.concepts.filter(function(d){return d.id==kc_id;})[0].weight;
							rec_score = rec_score + (kc_weight*kc_diff);
							weights_sum = weights_sum + kc_weight;

							var kc_level = kc_levels[kc_id]["k"];
							if (kc_level>.5){
								condition_to_generate_recommendations = true;
							}
							var kc_lastksr= kc_levels[kc_id]["lastk-sr"];

							if(kc_lastksr!=-1 && kc_lastksr<=.5){
								if (kc_level<proficiency_threshold){
									problematic_kcs ++;
								}else{
									slip_kcs ++;
								}
							}
							if(kc_level>=proficiency_threshold){// && (kc_lastksr == -1 || kc_lastksr>.5)){
								helpful_kcs ++;
							}
						}
						
					}	
				}
				if (weights_sum>0){
					rec_score = rec_score/weights_sum;//Normalizing rec score with total of the sum of weights (?)
				}

				var rec_explanation = "This activity is recommended because:<ul style='padding-left:2em;margin-top:0;padding-top:0;margin-bottom:0;padding-bottom:0'>";

				if ((problematic_kcs+slip_kcs)>0){
					rec_explanation = rec_explanation + "<li style='padding-left:0'>It allows you to practice <b>"+(problematic_kcs + slip_kcs)+"</b> concepts which <span style='color:red; font-weight: bold;'>might have caused problems</span> in the past.</li>"
					//rec_explanation = rec_explanation + "<li>You have struggled in "+(problematic_kcs + slip_kcs)+" related concepts";
					// Peter suggested to hide this part of the explanation
					// if (slip_kcs){
					// 	rec_explanation = rec_explanation+ " , but you have shown proficiency in "+slip_kcs+" of them. </li>";
					// }
					//rec_explanation = rec_explanation + "<br>";
				}
				if (helpful_kcs>0){
					rec_explanation = rec_explanation + "<li>You have <span style='color:green; font-weight: bold;' >good knowledge</span> of <b>"+helpful_kcs+"</b> concepts out of <b>"+total_kcs+"</b> necessary to succesfully ";//attempt this activity.</li>"
					var is_sqlknot = activity["url"].indexOf("sqlknot")>=0 ;
					var is_example = (activity["url"].indexOf("webex")>=0 || activity["url"].indexOf("sql_ae"));
					if(is_sqlknot){
						rec_explanation = rec_explanation + " solve this problem.</li>";
					}else{
						if(is_example){
							rec_explanation = rec_explanation + " understand this example.</li>";
						}
					}	
				}
				//Generate recommendations only if they have failed in the lastk attempts
				if((problematic_kcs+slip_kcs)>0){
					condition_to_generate_recommendations = true;
					rec_explanation = rec_explanation + "</ul>";

					ranked_activity = Object.assign({}, activity);
					ranked_activity["rec_score"] = rec_score;
					ranked_activity["topic"] = topic_name;
					ranked_activity["explanation"] = rec_explanation;
					recommendations.push(ranked_activity);
				}
				
			}
		}
	}
	recommendations.sort(compareActivities);

	//Delete the activities from the topics that were decided to not to be recommended
	recommendations = recommendations.filter(function(d){return !non_recommended_topics.includes(d.topic);});

	if(!condition_to_generate_recommendations){
		recommendations = [];
	}
	return recommendations;
}

/***
Peter's explanation text:
- It allows you to practice X concepts, which might have caused problems in the past
- It is not too complicated for -- you have good knowledge of Y concepts out of Z necessary to solve this problem [or “To understand this example”]
***/


// ------------------------------------------------------------------------------------------------------
/**
 * Recommendation approach: Knowledge Maximization (km) 
 * Generate a list of recommended content list based on the balance between the knowledge of
 * prerequisite and outcome concepts
 */
function generateKMRecommendations(topics_concepts, topic, topics_activities, kc_levels, kc_topic_weights, weight_kcs){
	//Define the outcome and prerequisites for the current topic
	var topicOrder = -1;
	var topic_name = topic.name;
	var topicInfo = topics_concepts.filter(function(d){
		return d.topicId == topic_name;
	});
	if (topicInfo && topicInfo.length>0){
		topicOrder = topicInfo[0].topicOrder;
	}
	var topic_activities = topics_activities[topic_name];

	var prerequisites = []
	prerequisites = topics_concepts.filter(function(d){return d.topicOrder < topicOrder});
	for(var i=0; i<prerequisites.length;i++){
		var prerequisite_concept = prerequisites[i];
		kc_levels[prerequisite_concept.conceptId].type = "prerequisite";
	}
	var set_prerequisites = new Set(prerequisites.map(function(d){ return d.conceptId}));
	console.log("Set of prerequisites:");
	console.log(set_prerequisites);

	var outcomes =[]
	outcomes = topics_concepts.filter(function(d){return d.topicOrder == topicOrder});
	for(var i=0; i<outcomes.length;i++){
		var outcome_concept = outcomes[i]
		kc_levels[outcome_concept.conceptId].type = "outcome";
	}
	var set_outcomes = new Set(outcomes.map(function(d){ return d.conceptId}));
	console.log("Set of outcomes:");
	console.log(set_outcomes);

	// Calculate the weights for outcomes and prerequisite concepts using TF-IDF (boolean in this case as we do not have number of times that concept appears in an activity)
	// starting from idf values
	var idf_values = {};
	var prerequisite_idfs = [];
	var outcome_idfs = [];
	var total_acts_prev_topics = topics_concepts.filter(function(d){return d.topicOrder<=topicOrder;}).map(function(d){return d.topicActs;}).reduce(function(a, b) { return a + b; });
	for(var i=0;i<prerequisites.length;i++){
		var prerequisite = prerequisites[i];
		var prerequisite_id = prerequisite.conceptId;
		var prerequisite_prev_appereances = topics_concepts.filter(function(d){return (d.topicOrder<=topicOrder && d.conceptId==prerequisite_id)});
		var num_acts_prerequisite = prerequisite_prev_appereances.map(function(d){return d.conceptActs}).reduce(function(a, b) { return a + b; });
		var idf_concept =  Math.log(total_acts_prev_topics/num_acts_prerequisite);
	}

	for(var i=0;i<prerequisites.length;i++){
		var prerequisite = prerequisites[i];
		var prerequisite_id = prerequisite.conceptId;
		var prerequisite_prev_appereances = topics_concepts.filter(function(d){return (d.topicOrder<=topicOrder && d.conceptId==prerequisite_id)});
		var num_acts_prerequisite = prerequisite_prev_appereances.map(function(d){return d.conceptActs}).reduce(function(a, b) { return a + b; });
		var idf_concept =  Math.log(total_acts_prev_topics/num_acts_prerequisite);
		idf_values[prerequisite_id] = idf_concept;
		prerequisite_idfs.push({'conceptId': prerequisite_id, 'value': idf_concept});
	}

	for(var i=0;i<outcomes.length;i++){
		var outcome = outcomes[i];
		var outcome_id = outcome.conceptId;
		var outcome_prev_appereances = topics_concepts.filter(function(d){return (d.topicOrder<=topicOrder && d.conceptId==outcome_id)});
		var num_acts_outcome = outcome_prev_appereances.map(function(d){return d.conceptActs}).reduce(function(a, b) { return a + b; });
		var idf_concept =  Math.log(total_acts_prev_topics/num_acts_outcome);
		idf_values[outcome_id] = idf_concept;
		outcome_idfs.push({'conceptId': outcome_id, 'value': idf_concept});
	}

	//Sort idf values for generating explanations for km recommendations
	prerequisite_idfs.sort(function(a,b){return b.value-a.value;});
	outcome_idfs.sort(function(a,b){return b.value-a.value;});

	console.log("Prerequisite idf values:");
	console.log(prerequisite_idfs);
	console.log("Outcome idf values:");
	console.log(outcome_idfs)

	var recommendations = [];
	//var topics = data_topics_acts_kcs;
	//var n_topics = topics.length;

	//If at least one of the kcs have a level > .5, we generate the recommendations
	//var condition_to_generate_recommendations = false;

	// for(var i=1; i<n_topics;i++){
	// var topic = topics[i];
	// var topic_name = topic.name;

	//First we see if there are never attempted outcome concepts
	var num_non_attempted_concepts = 0;
	var non_attempted_concepts = [];
	for(var i=0;i<outcomes.length;i++){
		var outcome_conceptId = outcomes[i].conceptId;
		var outcome_concept_k = kc_levels[outcome_conceptId].k;
		//Here we check if a concept has been attempted in a previous activity 
		if(outcome_concept_k==.5){//TODO: we should check the real number of attempts instead the kc level given by bn_general
			num_non_attempted_concepts= num_non_attempted_concepts + 1;
			non_attempted_concepts.push(outcome_conceptId);
		}
	}

	console.log(num_non_attempted_concepts+" outcome concepts have not been attempted in the past");
	console.log(non_attempted_concepts);

	var resources = Object.keys(topic.activities);

	var example_recommendations = [];
	//If there are concepts that have not been attempted in the past
	if(num_non_attempted_concepts>0){
		var resource_id = "Examples";
		if(resources.includes(resource_id)){
			var activities = topic.activities[resource_id];
			var n_activities = activities.length;
			for (var k=0;k<n_activities;k++){
				var activity = activities[k];
				var kcs = activity["kcs"];

				//Identify the overlapping concepts between the non attempted concepts (for that specific student) and the kcs of the example activities
				var overlap_non_attempted_outcomes_kcs = kcs.filter(function(n) {
					return non_attempted_concepts.indexOf(n) !== -1;
				});

				console.log("Overlap non-attempted outcome concepts");
				console.log(overlap_non_attempted_outcomes_kcs);
				
				var rec_score = 0;
	
				var act_progress = 0;
				act_progress = topic_activities[resource_id][activity.id].values.p;
	
				// Only examples that include non-attempted outcome concepts
				// and the non-completed ones will be recommended (progress - p - less than 1) are candidates to be recommended first
				if(overlap_non_attempted_outcomes_kcs.length>0 && act_progress<1){
					//Total number of concepts needed for solving the problem / understanding the example
					var total_kcs = 0;
					var total_prerequisites = 0;
					var total_outcomes = 0;
	
					//Variables needed for estimating the amount of knowledge already learned associated with prerequisite concepts
					var prerequisites_mastery = 0;
					var weight_prerequisites = 0;
	
					//Variables needed for estimating the amount of knowledge yet to be learned associated with outcomeconcepts
					var outcomes_lack_mastery = 0;
					var weight_outcomes = 0;
	
					for (var l=0;l<kcs.length;l++){
						var kc_id = kcs[l];
	
						if (kc_id in kc_levels){ //Check if we have an estimation of the knowledge on that specific concept
							//if a concept is a prerequisite for the topic, it adds its knowledge value to the amount of mastered prereq knowledge
							if (set_prerequisites.has(kc_id)){
								var prerequisite_weight = Math.log(1*idf_values[kc_id]);
								prerequisites_mastery = prerequisites_mastery + prerequisite_weight*kc_levels[kc_id].k;
								total_kcs = total_kcs + 1
								weight_prerequisites = prerequisite_weight + weight_prerequisites
								total_prerequisites = total_prerequisites + 1;
							}else{
								//if a concept is an outcome for the topic, it adds the amount of knowledge yet to be known for that concept
								if(set_outcomes.has(kc_id)){
									var outcome_weight = Math.log(1*idf_values[kc_id]);
									outcomes_lack_mastery = outcomes_lack_mastery + outcome_weight*(1-kc_levels[kc_id].k);
									total_kcs = total_kcs + 1
									weight_outcomes = outcome_weight + weight_outcomes
									total_outcomes = total_outcomes + 1;
								}
							}
						}
					}		
					if(weight_prerequisites>0){
						rec_score = rec_score + total_prerequisites * prerequisites_mastery/weight_prerequisites;
					}
					if(weight_outcomes>0){
						rec_score = rec_score + total_outcomes * outcomes_lack_mastery/weight_outcomes;
					}
					rec_score=rec_score/total_kcs;
					
					//console.log(activity.id)
					//console.log("Rec score: "+rec_score);
					console.log()
					var rec_explanation = "This example is recommended because it presents <span class='important-text'>concept(s) that are new</span> to you (e.g. <i>"+kc_topic_weights.filter(function(d){return d.id==overlap_non_attempted_outcomes_kcs[0];})[0].dn+"</i>).";

					ranked_activity = Object.assign({}, activity);
					ranked_activity["rec_score"] = rec_score;
					ranked_activity["topic"] = topic_name;
					ranked_activity["explanation"] = rec_explanation;
					example_recommendations.push(ranked_activity);
				}	
			}
			if(example_recommendations.length>0){
				//Sort the array of prioritized example recommendations
				example_recommendations.sort(compareActivities);

				//We get only 2 examples from the candidate examples that cover 
				example_recommendations = example_recommendations.slice(0,2);

				console.log("Array of prioritized example recommendations: ");
				console.log(example_recommendations);
				
			}			
		}
	}

	var n_resources = resources.length;
	for (var j=0; j<n_resources;j++){
		var resource_id = resources[j];
		if (resource_id != "Examples" || (resource_id=="Examples" && example_recommendations.length==0)){
			var activities = topic.activities[resource_id];
			var n_activities = activities.length;
			for (var k=0;k<n_activities;k++){
				var activity = activities[k];
				var kcs = activity["kcs"];
				var rec_score = 0;

				var act_progress = 0;
				act_progress = topic_activities[resource_id][activity.id].values.p;

				//Only non-completed activities will be recommended (progress - p - less than 1)
				if(act_progress<1){
					//Total number of concepts needed for solving the problem / understanding the example
					var total_kcs = 0;
					var total_prerequisites =0;
					var total_outcomes =0;

					//Variables needed for estimating the amount of knowledge already learned associated with prerequisite concepts
					var prerequisites_mastery = 0;
					var weight_prerequisites = 0;
					var ids_act_prerequisites = new Set();

					//Variables needed for estimating the amount of knowledge yet to be learned associated with outcomeconcepts
					var outcomes_lack_mastery = 0;
					var weight_outcomes = 0;
					var ids_act_outcomes = new Set();

					for (var l=0;l<kcs.length;l++){
						var kc_id = kcs[l];

						if (kc_id in kc_levels){ //Check if we have an estimation of the knowledge on that specific concept
							//if a concept is a prerequisite for the topic, it adds its knowledge value to the amount of mastered prereq knowledge
							if (set_prerequisites.has(kc_id)){
								var prerequisite_weight = Math.log(1*idf_values[kc_id]);
								ids_act_prerequisites.add(kc_id);
								prerequisites_mastery = prerequisites_mastery + prerequisite_weight*kc_levels[kc_id].k;
								total_kcs = total_kcs + 1
								weight_prerequisites = prerequisite_weight + weight_prerequisites
								total_prerequisites = total_prerequisites + 1;
							}else{
								//if a concept is an outcome for the topic, it adds the amount of knowledge yet to be known for that concept
								if(set_outcomes.has(kc_id)){
									var outcome_weight = Math.log(1*idf_values[kc_id]);
									ids_act_outcomes.add(kc_id);
									outcomes_lack_mastery = outcomes_lack_mastery + outcome_weight*(1-kc_levels[kc_id].k);
									total_kcs = total_kcs + 1
									weight_outcomes = outcome_weight + weight_outcomes
									total_outcomes = total_outcomes + 1;
								}
							}
						}
					}
					if(total_prerequisites>0){
						rec_score = rec_score + total_prerequisites * prerequisites_mastery/weight_prerequisites;
					}
					if(total_outcomes>0){
						rec_score = rec_score + total_outcomes * outcomes_lack_mastery/weight_outcomes;
					}
					rec_score=rec_score/(total_prerequisites + total_outcomes);

					var rec_explanation = "This activity is recommended because:<ul style='padding-left:2em;margin-top:0;padding-top:0;margin-bottom:0;padding-bottom:0'>";
					
					//console.log(activity.id);
					//console.log("Rec score: "+rec_score);

					var top_num_concepts = 3;
					var top_prerequisite_concepts = prerequisite_idfs.filter(function(d){return ids_act_prerequisites.has(d.conceptId);}).slice(0,top_num_concepts);
					var top_outcome_concepts = outcome_idfs.filter(function(d){return ids_act_outcomes.has(d.conceptId);}).slice(0,top_num_concepts);

					//Threshold and definitions for the explanations
					var mastery_concepts = 0;
					var mastery_threshold = .95;
					var proficiency_concepts = 0;
					var proficiency_threshold = .75;
					var good_concepts = 0;
					var good_threshold = .6;
					var ok_concepts = 0;

					var avg_k_prerequisite_concepts = 0;
					var total_weight_prerequisites = 0;
					for(var i=0;i<top_prerequisite_concepts.length;i++){
						var k_concept = kc_levels[top_prerequisite_concepts[i].conceptId].k;
						var weight_concept = Math.log(1*idf_values[top_prerequisite_concepts[i].conceptId]);
						if(k_concept>=mastery_threshold){
							mastery_concepts++;
						}else{
							if(k_concept>=proficiency_threshold){
								proficiency_concepts++;
							}else{
								if(k_concept>=good_threshold){
									good_concepts++;
								}else{
									ok_concepts++;
								}
							}
						}
						avg_k_prerequisite_concepts = avg_k_prerequisite_concepts + weight_concept*k_concept;
						total_weight_prerequisites = total_weight_prerequisites + weight_concept;
					}

					avg_k_prerequisite_concepts = avg_k_prerequisite_concepts/total_weight_prerequisites;
					if(top_prerequisite_concepts.length<top_num_concepts) top_num_concepts=top_prerequisite_concepts.length;

					var prerequisite_explanation = "";

					if(top_prerequisite_concepts && top_prerequisite_concepts.length>0){
						console.log("Average most important prerequisites:");
						console.log(avg_k_prerequisite_concepts);
						if(avg_k_prerequisite_concepts>=mastery_threshold){
							prerequisite_explanation+="<li>It looks like in average you <span class='level1-exp-text'>master</span> the main <span class='important-text'>prerequisite concepts</span>.</li>";
						}else{
							if(avg_k_prerequisite_concepts>=proficiency_threshold){
								prerequisite_explanation+="<li>It looks like in average you are <span sclass='level2-exp-text'>proficient</span> on the main <span class='important-text'>prerequisite concepts</span>.</li>";
							}else{
								if(avg_k_prerequisite_concepts>=good_threshold){
									prerequisite_explanation+="<li>It looks like in average you have a <span class='level3-exp-text'>good</span> understanding on the main <span class='important-text'>prerequisite concepts</span>.</li>";
								}else{
									prerequisite_explanation+="<li>Altough it is low, your knowledge level on the main <span class='important-text'>prerequisite concepts</span> is one of the highest within the topic.</li>";
								}
							}
						}
					}
					var excellent_opportunity_threshold =.8;
					var good_opportunity_threshold =.6;
					var fair_opportunity_threshold = .4; 

					var avg_k_outcome_concepts = 0;
					var total_weight_outcomes = 0;
					for(var i=0;i<top_outcome_concepts.length;i++){
						var k_concept = 1- kc_levels[top_outcome_concepts[i].conceptId].k;
						var weight_concept = Math.log(1*idf_values[top_outcome_concepts[i].conceptId]);
						avg_k_outcome_concepts = avg_k_outcome_concepts + weight_concept*k_concept;
						total_weight_outcomes = total_weight_outcomes + weight_concept;
					}

					avg_k_outcome_concepts = avg_k_outcome_concepts/total_weight_outcomes;
					if(top_outcome_concepts.length<top_num_concepts) top_num_concepts=top_outcome_concepts.length;

					var outcome_explanation = "";
					console.log(top_outcome_concepts);
					if(top_outcome_concepts && top_outcome_concepts.length>0){
						console.log("Average learning opportunity of most important outcomes:");
						console.log(avg_k_outcome_concepts);
						if(avg_k_outcome_concepts>=excellent_opportunity_threshold){
							outcome_explanation+="<li>You have an <span class='level1-exp-text'>excellent</span> opportunity for <span class='important-text'>increasing your knowledge</span> on key concepts introduced in this topic.</li>";
						}else{
							if(avg_k_outcome_concepts>=good_opportunity_threshold){
								outcome_explanation+="<li>You have a <span class='level2-exp-text'>good</span> opportunity for <span class='important-text'>increasing your knowledge</span> on key concepts introduced in this topic.</li>";
							}else{
								if(avg_k_outcome_concepts>=fair_opportunity_threshold){
									outcome_explanation+="<li>You have a <span class='level3-exp-text'>fair</span> opportunity for <span class='important-text'>increasing your knowledge</span> on key concepts introduced in this topic.</li>";
								}else{
									outcome_explanation+="<li>Altough it is low, the opportunity for <span class='important-text'>increasing your knowledge</span> on key concepts introduced in this topic is one of the highest within the topic.</li>";
								}
							}
						}
					}
	
					rec_explanation = rec_explanation + prerequisite_explanation;
					rec_explanation = rec_explanation + outcome_explanation;
					rec_explanation = rec_explanation + "</ul>";

					// var avg_k_top_outcomes = 0;
					// for(var i=0;i<top_outcome_concepts.length;i++){
					// 	var 
					// }

					

					//Commented by @Jordan from here
					// if ((problematic_kcs+slip_kcs)>0){
					// 	rec_explanation = rec_explanation + "<li style='padding-left:0'>It allows you to practice <b>"+(problematic_kcs + slip_kcs)+"</b> concepts which <span style='color:red; font-weight: bold;'>might have caused problems</span> in the past.</li>"
					// 	//rec_explanation = rec_explanation + "<li>You have struggled in "+(problematic_kcs + slip_kcs)+" related concepts";
					// 	// Peter suggested to hide this part of the explanation
					// 	// if (slip_kcs){
					// 	// 	rec_explanation = rec_explanation+ " , but you have shown proficiency in "+slip_kcs+" of them. </li>";
					// 	// }
					// 	//rec_explanation = rec_explanation + "<br>";
					// }
					// if (helpful_kcs>0){
					// 	rec_explanation = rec_explanation + "<li>You have <span style='color:green; font-weight: bold;' >good knowledge</span> of <b>"+helpful_kcs+"</b> concepts out of <b>"+total_kcs+"</b> necessary to succesfully ";//attempt this activity.</li>"
					// 	var is_sqlknot = activity["url"].indexOf("sqlknot")>=0 ;
					// 	var is_example = (activity["url"].indexOf("webex")>=0 || activity["url"].indexOf("sql_ae"));
					// 	if(is_sqlknot){
					// 		rec_explanation = rec_explanation + " solve this problem.</li>";
					// 	}else{
					// 		if(is_example){
					// 			rec_explanation = rec_explanation + " understand this example.</li>";
					// 		}
					// 	}	
					// }
					// //Generate recommendations only if they have failed in the lastk attempts
					// if((problematic_kcs+slip_kcs)>0){
					// 	condition_to_generate_recommendations = true;
					// 	rec_explanation = rec_explanation + "</ul>";

					ranked_activity = Object.assign({}, activity);
					ranked_activity["rec_score"] = rec_score;
					ranked_activity["topic"] = topic_name;
					ranked_activity["explanation"] = rec_explanation;
					recommendations.push(ranked_activity);
					// }
					//end of Jordan's comment
				}	
			}
		}
	}
	//}
	if(recommendations.length>0){
		recommendations.sort(compareActivities);
	}
	//Delete the activities from the topics that were decided to not to be recommended
	//recommendations = recommendations.filter(function(d){return !non_recommended_topics.includes(d.topic);});
	// if(!condition_to_generate_recommendations){
	// 	recommendations = [];
	// }
	var merged_recommendations = example_recommendations.concat(recommendations);
	return merged_recommendations;
}

// ------------------------------------------------------------------------------------------------------
/**
 * Sort the activity objects according to their recommendation score
 */
function compareActivities(a,b) {
  if (a.rec_score > b.rec_score)
    return -1;
  if (a.rec_score < b.rec_score)
    return 1;
  return 0;
}

// ------------------------------------------------------------------------------------------------------
/**
 * Sort the activity objects according to their recommendation score
 */
function calculateKcDifficultyScores(kc_levels, weight_kcs, weight_sr) {
  var kcs_ids = Object.keys(kc_levels);
  for(var i=0;i<kcs_ids.length;i++){
  	var kc_id = kcs_ids[i];
  	var kc_level = kc_levels[kc_id]["k"];
  	var lastk_sr = kc_levels[kc_id]["lastk-sr"];
  	var overall_sr = kc_levels[kc_id]["sr"];
  	var kc_difficulty_score = - 1;
  	if(lastk_sr>0){
  		kc_difficulty_score = 1 - (lastk_sr*weight_sr + kc_level*weight_kcs);
  	}else{
  		if(overall_sr>0){
  			kc_difficulty_score = 1 - (overall_sr*weight_sr + kc_level*weight_kcs);
  		}else{
  			kc_difficulty_score = 1;
  		}
  	}
  	kc_levels[kc_id]["diff"]=kc_difficulty_score;
  }
}


function addRecommendationsToUI(){
	console.log("Add recommendation to UI...");
	console.log(top_recommended_activities);

	//Remove existing stars
	d3.selectAll(".recommendationStar").remove();
	d3.selectAll(".recommended_act").classed("recommended_act",false);

    if(top_recommended_activities && top_recommended_activities.length > 0) {
		
		var topic_rec_activities = top_recommended_activities.filter(activity => activity.topic == getTopic().name)
		
		if(topic_rec_activities.length > 0) {

			console.log("Rank recommended activities:");
			console.log(rank_recommended_activities);

			d3.selectAll("g.grid-cell-outter").each( function(d, i){
				var current_topic = data.topics[d.topicIdx]
				var mg_activities = current_topic ? current_topic.activities:undefined;
				var data_resource = data.resources[d.resIdx]
				var data_resource_id = data_resource ? data_resource.id:undefined;
				var data_resource =  data_resource_id && mg_activities ? mg_activities[data_resource_id]:undefined;
				var mg_activity = data_resource ? data_resource[d.actIdx]:undefined;
				//var mg_activity = data.topics[d.topicIdx].activities[data.resources[d.resIdx].id][d.actIdx]
				if(mg_activity) {
					var act_id = mg_activity.id
					var act_name = d.actName;
					var act_is_recommended = (act_id in rank_recommended_activities);
					mg_activity['actIdx'] = d.actIdx
					mg_activity['topicIdx'] = d.topicIdx
					mg_activity['resIdx'] = d.resIdx

					if(act_is_recommended){

						//This is to fix the globally stored top_recommended_activities array. (To solve the problem of first topic openning)
						let recommended_activity = top_recommended_activities.find(x => x.id === mg_activity.id)
						recommended_activity['actIdx'] = d.actIdx
						recommended_activity['topicIdx'] = d.topicIdx
						recommended_activity['resIdx'] = d.resIdx

						d3.select(this).classed("recommended_act", true);
						// d3.select(this).append("svg:image")
						// .attr('x', 8)
						// .attr('y', 2)
						// .attr('width', scaleRecommendationStar(rank_recommended_activities[act_id]))
						// .attr('height', scaleRecommendationStar(rank_recommended_activities[act_id]))
						// .attr("class","recommendationStar")
						// .attr("xlink:href", function(d){
						// 	return "./img/star.png";
						// })
						// .style("pointer-events","none");
						var rank_rec = rank_recommended_activities[act_id];

;						var map_rank_to_seq = -1;

						if(rank_rec===0){
							map_rank_to_seq = 1;
						}else{
							if(rank_rec===1){
								map_rank_to_seq = 0.7;
							}else{
								if(rank_rec===2){
									map_rank_to_seq = 0.3;
								}else{
									map_rank_to_seq= 0.0;
								}
							}
						}
						
						d3.select(this)
							.append("svg:polygon")
							//.attr("id", "star_1")
							.attr("visibility", "visible")
							//.attr("points", CalculateStarPoints(6, 6, function (d) { return (d.seq === 0 ? 0 : 5); }, 10, 5))
							.attr("points", function (d) { d.seq = map_rank_to_seq; console.log(d.seq); return ( d.seq === 0 ? "0,0" : CalculateStarPoints(6, 6, 5, Math.max((2+Math.round(8*(d.seq-0.50)/0.5)),4), Math.max((2+Math.round(8*(d.seq-0.50)/0.5))/2,2))); })
							.attr("style", function (d) { return "fill: " + CONST.vis.colors.sequencing + ";"; })
							//.attr("style", function (d) { return "border: 1px solid #FFFFFF;"; })
							.attr("stroke", "white")
							.attr("max_rec_rank_act",rank_recommended_activities[act_id])
							.attr("class","rec_topic")
							.style("shape-rendering", "geometricPrecision")
							.style("pointer-events","none");
						
						d3.select(this)
							.append("text").
							attr("x", 15).
							attr("y", 15).
							style("text-anchor", "start").
							text(function (d) { 
								if(d.seq === 1) {
									return " 1";
								} else if (d.seq === 0.7) {
									return " 2";
								} else if (d.seq === 0.3){
									return " 3";
								} else{
									return "";
								}
							
							/*if(d.seq === 1) {
								return "+6";
							} else if (d.seq === 0.7) {
								return "+4";
							} else {
								return "+2";
							}*/
							})
							.attr("font-family", "sans-serif")
									.attr("font-size", "12px")
							.attr("style", function(d) {
							var colorIndex = Math.round(data.vis.color.value2color(d.val)*10);
							var color = colorbrewer.Oranges[9][8-Math.min(colorIndex,8)];
							return "fill: " + color + ";"; 
							});
					};
				}
				
			});
		}
	}
}

function generateProactiveRecommendations(method){
	if(method=="km"){
		console.log("Generate KM recommendations....");

		var topic = getTopic();

		if (topic==null) return;

		recommended_activities = generateKMRecommendations(topics_concepts, topic, data.learners[0].state.activities, data.learners[0].state.kcs, data.kcs, 0.5);
	
		top_recommended_activities = recommended_activities.slice(0,3);
		rank_recommended_activities = {};
	
		console.log("Top recommended activities:");
		console.log(top_recommended_activities);
			
		//Here we get the maximum rank of the items recommended per topic
		for(var i=0;i<top_recommended_activities.length;i++){
		  var rec_act_topic = top_recommended_activities[i]["topic"];
		  var rec_act_name  = top_recommended_activities[i]["name"];
		  var rec_act_id  = top_recommended_activities[i]["id"];
		  if (!(rec_act_topic in map_topic_max_rank_rec_act)){
			map_topic_max_rank_rec_act[rec_act_topic] = i;
		  }
		  rank_recommended_activities[rec_act_id] = i;
		}
	
		//Post array of recommended activities to the server (http://pawscomp2.sis.pitt.edu/recommendations/LogRecommendations)
		if(recommended_activities.length>0){
			//Prepare the array of recommendations for storing it in ent_recommendation db in the server (rec schema)
			for(var j=0;j<recommended_activities.length;j++){
			  var rec_act_id  = recommended_activities[j]["id"];
			  if (rec_act_id in rank_recommended_activities){
				recommended_activities[j]["isRecommended"]="1";
			  }else{
				recommended_activities[j]["isRecommended"]="0";
			  }
			}
			var millisecondsDate = (new Date).getTime();
			$.ajax({
			  type: "POST",
			  data :JSON.stringify({"usr":state.curr.usr,
			  "grp":state.curr.grp,
			  "sid":state.curr.sid,
			  "cid":state.curr.cid,
			  "sid":state.curr.sid,
			  "logRecId":millisecondsDate.toString(),
			  "recMethod":"bn-KM",
			  "recommendations":recommended_activities}),
			  url: "http://" + CONST.hostName + "/recommendation/LogRecommendations",
			  contentType: "application/json"
			});
		}
	  }
}