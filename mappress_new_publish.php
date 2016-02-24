<?php
/*
Plugin Name: Mappress Adding Map id of Published post
Plugin URI: #
Description: Mappress Adding Map id of Published post
Version: 1.0
Author: Grype Solutions
*/





function Mappress_Publish() {
		global $post_ID;
		global $wp_current_filter;
		static $last_post_id;
        global $post;
		global $wpdb;
		$maps_table = $wpdb->prefix . 'mappress_maps';
		$posts_table = $wpdb->prefix . 'mappress_posts';
		$posts_t = $wpdb->prefix . 'posts';
		$con = $wpdb->get_results("select post_content from $posts_t where ID = ".$post_ID."");
		$not_in_body = array();
		
		foreach($con as $content){
			$str = array();
			$str_maptag = array();
			$str_map_tag_split = array();
			$str_mapid = array();
			$pattern = get_shortcode_regex();
			preg_match_all( '/'. $pattern .'/s', $content->post_content,$tags_all);
			foreach ($tags_all as $tags_all1){
				foreach ($tags_all1 as $tags_all2){
					
					if(substr_count($tags_all2,"mappress")){
					   if(substr_count($tags_all2,"mapid")){
							if(!in_array($tags_all2,$str_maptag)){
							   $str_maptag[] = $tags_all2;
							}
						}	
					}
					
					
				}
			}
			foreach($str_maptag as $str_maptag1){
			   
				$str_map_tag_split = preg_split('/\"/',$str_maptag1);
				
				foreach($str_map_tag_split as $str_map_tag_split1){ 
					if(substr_count($str_map_tag_split1," ")){
						 $str_map_tag_split12 = shortcode_parse_atts($str_map_tag_split1);
						 
						foreach($str_map_tag_split12 as $str_map_tag_split2){
						 
							if(is_numeric($str_map_tag_split2)){
								
								$not_in_body[] = (int)$str_map_tag_split2;
								$result = $wpdb->query($wpdb->prepare("INSERT INTO $posts_table (postid, mapid) VALUES(%d, %d) ON DUPLICATE KEY UPDATE postid = %d, mapid = %d", $post_ID,$str_map_tag_split2,
																	$post_ID,$str_map_tag_split2));
									
							}
						 
						}
					}
					else{
				
						if(is_numeric($str_map_tag_split1)){
							$not_in_body[] = (int)$str_map_tag_split1;
							$result = $wpdb->query($wpdb->prepare("INSERT INTO $posts_table (postid, mapid) VALUES(%d, %d) ON DUPLICATE KEY UPDATE postid = %d, mapid = %d", $post_ID,$str_map_tag_split1,
																  $post_ID,$str_map_tag_split1));
							
						}
					}  
					
				} 
			}
		
	    }
		$map_in_db = $wpdb->get_results("select * from $posts_table where postid = ".$post_ID."");
		
		foreach ($map_in_db as $map_in_dbs){
		  if(!(in_array($map_in_dbs->mapid, $not_in_body))){
				     $wpdb->query("Delete from $posts_table where postid = ".$post_ID." and mapid = ".$map_in_dbs->mapid ."");
			 }
				
		}
		
}

	
function mappress_post_delete_init() {
    if (!did_action('delete_post')) add_action('delete_post','mappress_post_delete_sync');
}

function mappress_post_delete_sync() {
  global $wpdb;
  global $post_ID;
  $posts_table = $wpdb->prefix . 'mappress_posts';
  
  return $wpdb->query("delete from $posts_table where postid =".$post_ID."");
  return true;
}


add_action('publish_post','Mappress_Publish');
add_action('save_post', 'Mappress_Publish');
add_action('admin_init', 'mappress_post_delete_init');
	
?>
