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
function generateKMRecommendations(topics_concepts, topic, data_topics_acts_kcs, kc_levels, kc_topic_weights, weight_kcs){
	//Define the outcome and prerequisites for the current topic
	var topicOrder = -1;
	var topic_name = topic.name;
	var topicInfo = topics_concepts.filter(function(d){
		return d.topicId == topic_name;
	});
	if (topicInfo && topicInfo.length>0){
		topicOrder = topicInfo[0].topicOrder;
	}

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

	// var proficiency_threshold = .66;
	// var filtered_kcs = kc_topic_weights.map(function(d){return d.id});
	// var filtered_kc_levels = {};
	// for (var i=0; i<filtered_kcs.length;i++){
	// 	var kc_id = filtered_kcs[i];
	// 	if (kc_levels.hasOwnProperty(kc_id)) {
    //         filtered_kc_levels[kc_id] = kc_levels[kc_id];
    //     }
	// }
  
	// kc_levels = filtered_kc_levels;
	//calculateKcDifficultyScores(kc_levels, weight_kcs, weight_sr);
	var recommendations = [];
	var topics = data_topics_acts_kcs;
	var n_topics = topics.length;

	//If at least one of the kcs have a level > .5, we generate the recommendations
	//var condition_to_generate_recommendations = false;

//	for(var i=1; i<n_topics;i++){
//	var topic = topics[i];
//	var topic_name = topic.name;

	var resources = Object.keys(topic.activities);
	console.log(topic.activities);
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
						var prerequisite_weight = 1;
						prerequisites_mastery = prerequisites_mastery + prerequisite_weight*kc_levels[kc_id].k;
						total_kcs = total_kcs + 1
						weight_prerequisites = prerequisite_weight + weight_prerequisites
					}else{
						//if a concept is an outcome for the topic, it adds the amount of knowledge yet to be known for that concept
						if(set_outcomes.has(kc_id)){
							var outcome_weight = 1;
							outcomes_lack_mastery = outcomes_lack_mastery + outcome_weight*(1-kc_levels[kc_id].k);
							total_kcs = total_kcs + 1
							weight_outcomes = outcome_weight + weight_outcomes
						}
					}
					// var kc_diff = kc_levels[kc_id]["diff"];
					// if(kc_diff>=0){
					// 	total_kcs ++;
					// 	var kc_weight = topic.concepts.filter(function(d){return d.id==kc_id;})[0].weight;
					// 	rec_score = rec_score + (kc_weight*kc_diff);
					// 	weights_sum = weights_sum + kc_weight;

					// 	var kc_level = kc_levels[kc_id]["k"];
					// 	if (kc_level>.5){
					// 		condition_to_generate_recommendations = true;
					// 	}
					// 	var kc_lastksr= kc_levels[kc_id]["lastk-sr"];

					// 	if(kc_lastksr!=-1 && kc_lastksr<=.5){
					// 		if (kc_level<proficiency_threshold){
					// 			problematic_kcs ++;
					// 		}else{
					// 			slip_kcs ++;
					// 		}
					// 	}
					// 	if(kc_level>=proficiency_threshold){// && (kc_lastksr == -1 || kc_lastksr>.5)){
					// 		helpful_kcs ++;
					// 	}
					// }
					
				}	
			}
			//if (weights_sum>0){
			//	rec_score = rec_score/weights_sum;//Normalizing rec score with total of the sum of weights (?)
			//}
			// console.log(activity);
			// console.log("Prerequisites mastery: ")
			// console.log(prerequisites_mastery);
			// console.log("Prerequisites weights: "+weight_prerequisites);
			// console.log("Outcomes mastery: ");
			// console.log(outcomes_lack_mastery);
			// console.log("Outcomes weights: "+weight_outcomes);

			
			if(weight_prerequisites>0){
				rec_score = rec_score + prerequisites_mastery/weight_prerequisites;
			}
			if(weight_outcomes>0){
				rec_score = rec_score + outcomes_lack_mastery/weight_outcomes;
			}
			rec_score=rec_score/2;
			
			console.log("Rec score: "+rec_score);

			var rec_explanation = "This activity is recommended because:<ul style='padding-left:2em;margin-top:0;padding-top:0;margin-bottom:0;padding-bottom:0'>";

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
	//}

	recommendations.sort(compareActivities);

	//Delete the activities from the topics that were decided to not to be recommended
	recommendations = recommendations.filter(function(d){return !non_recommended_topics.includes(d.topic);});

	// if(!condition_to_generate_recommendations){
	// 	recommendations = [];
	// }
	return recommendations;
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