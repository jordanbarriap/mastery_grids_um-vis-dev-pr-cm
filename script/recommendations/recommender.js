//Topics which have activities that should not be recommended
var non_recommended_topics = ["Table Creation", "Table Deletion and Alteration", "Key Constraints", "Tuple Insertion", "Tuple Deletion", "Tuple Update", "General Constraints", "Derived Relations and Views"];

// ------------------------------------------------------------------------------------------------------
/**
 * Generate a list of recommended content list based on problematic concepts and  
 * knowledge level infered for kcs
 */
function generateRecommendations(data_topics_acts_kcs, kc_levels, kc_topic_weights, weight_kcs, weight_sr){
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