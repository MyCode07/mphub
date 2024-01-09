<?php

function localize_cities_data(){
    if(!is_page(597)) return;

    $cities = new WP_Query(array(
        'post_type' => 'city',
        'post_status' => 'publish',
        'numberposts' => -1,
    ));

    if(!$cities -> have_posts()) return;

    $delivery_data = array();
    $route = array();

    while($cities -> have_posts()){
        $cities -> the_post();
        $from = get_the_title();

        $all_markets = get_field('marketplace');
        
        $market_name = array();
        $to = array();

        foreach($all_markets as $market){
            $market_id = $market['marketplace'];
            $markets[] = get_field('prefix', $market_id);

            $addresses = $market['mesta_dostavki'];
            foreach($addresses as $item){
                $mesto = $item['mesto'];

                $price = $item['price'];
                $price_min = $price['min'];
                $price_pallet = $price['pallet'];
                $price_cube = $price['cube'];

                $dop_uslugi = $item['dop_uslugi'];
                $palleta = $dop_uslugi['palleta'];
                $palletirovanie = $dop_uslugi['palletirovanie'];
                $zabor_gruza = $dop_uslugi['zabor_gruza'];

                $to[] = array(
                    'market' => get_field('prefix', $market_id),
                    'sklad' => $mesto,
                    'price_min'  => $price_min,
                    'price_pallet' => $price_pallet,
                    'price_cube' => $price_cube,
                    'palleta' => $palleta,
                    'palletirovanie' => $palletirovanie,
                    'zabor_gruza' => $zabor_gruza,
                );
            }
        }

        $route[] = array(
            'from' => $from,
            'to' => $to,
        );
    }
    wp_reset_postdata();
	
	$promocodes = get_field('promocodes', 'option');
	$promocodes_data = array();
	if($promocodes){
		foreach($promocodes as $item){
			$promocodes_data[] = array(
				'code' => $item['code'],
				'sale' => $item['sale'],
			);
		}		
	}

    $delivery_data = array( 
        'routes' => $route,
        'promocodes' => $promocodes_data,
    );
    wp_localize_script( 'app', 'delivery_data', $delivery_data );
}