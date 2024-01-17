<?php

// get OS
function getOS($user_agent) { 
	$os_platform =   "Bilinmeyen İşletim Sistemi";
	$os_array =   array(
		'/windows nt 11/i'      =>  'Windows 11',
		'/windows nt 10/i'      =>  'Windows 10',
		'/windows nt 6.3/i'     =>  'Windows 8.1',
		'/windows nt 6.2/i'     =>  'Windows 8',
		'/windows nt 6.1/i'     =>  'Windows 7',
		'/windows nt 6.0/i'     =>  'Windows Vista',
		'/windows nt 5.2/i'     =>  'Windows Server 2003/XP x64',
		'/windows nt 5.1/i'     =>  'Windows XP',
		'/windows xp/i'         =>  'Windows XP',
		'/windows nt 5.0/i'     =>  'Windows 2000',
		'/windows me/i'         =>  'Windows ME',
		'/win98/i'              =>  'Windows 98',
		'/win95/i'              =>  'Windows 95',
		'/win16/i'              =>  'Windows 3.11',
		'/macintosh|mac os x/i' =>  'Mac OS X',
		'/mac_powerpc/i'        =>  'Mac OS 9',
		'/linux/i'              =>  'Linux',
		'/ubuntu/i'             =>  'Ubuntu',
		'/iphone/i'             =>  'iPhone',
		'/ipod/i'               =>  'iPod',
		'/ipad/i'               =>  'iPad',
		'/android/i'            =>  'Android',
		'/blackberry/i'         =>  'BlackBerry',
		'/webos/i'              =>  'Mobile'
	);

	foreach ( $os_array as $regex => $value ) { 
		if ( preg_match($regex, $user_agent ) ) {
			$os_platform = $value;
		}
	}   
	return $os_platform;
}



// get browser
function getBrowser($user_agent) {
	$browser        = "Bilinmeyen Tarayıcı";
	$browser_array  = array(
		'/msie/i'       =>  'Internet Explorer',
		'/firefox/i'    =>  'Firefox',
		'/safari/i'     =>  'Safari',
		'/chrome/i'     =>  'Chrome',
		'/edge/i'       =>  'Edge',
		'/opera/i'      =>  'Opera',
		'/netscape/i'   =>  'Netscape',
		'/maxthon/i'    =>  'Maxthon',
		'/konqueror/i'  =>  'Konqueror',
		'/mobile/i'     =>  'Handheld Browser'
	);

	foreach ( $browser_array as $regex => $value ) { 
		if ( preg_match( $regex, $user_agent ) ) {
			$browser = $value;
		}
	}
	return $browser;
}



// set drom site name
add_filter( 'wp_mail_content_type', 'set_html_content_type' );
add_filter( 'wp_mail_from_name', function($from_name){
    return get_option( 'blogname' ); 
} );



// send form to email and to bitrix24
add_action( 'wp_ajax_send_form', 'send_form' );
add_action( 'wp_ajax_nopriv_send_form', 'send_form' ); 
function send_form(){
    $multiple_to_recipients = array(
        get_option( 'admin_email' ),
    );

    

    $utm_source = $_COOKIE['utm_source'] ?? '';
    $utm_campaign = $_COOKIE['utm_campaign'] ?? '';
    $utm_content = $_COOKIE['utm_content'] ?? '';
    $utm_term = $_COOKIE['utm_term'] ?? '';
    $utm_medium = $_COOKIE['utm_medium'] ?? '';

    $partnerID = $utm_medium;

    $email = esc_html($_POST['your_email']);
    $name = esc_html($_POST['your_name']);
    $phone = esc_html($_POST['your_phone']);

    
    $markteplace = esc_html($_POST['markteplace']);
    $from = esc_html($_POST['from']);
    $to = esc_html($_POST['to']);
  
    $transporting = esc_html($_POST['transporting']);
    $volume = esc_html($_POST['volume']);
    $promocode = esc_html($_POST['promocode']);

    $palleta = esc_html($_POST['palleta']);
    $palletirovanie = esc_html($_POST['palletirovanie']);
    $zabor_gruza = esc_html($_POST['zabor_gruza']);
    $services = esc_html($_POST['all_services']);

    $no_sale_price = esc_html($_POST['no_sale_price']);
    $total_price = esc_html($_POST['total_price']);

    $url =  'https://dostavka.mphub.ru';
    $source = 'Заявка с сайта mphub.ru';
    
    $count = null;
    $email = null;

    if(esc_html($_POST['count-box'])){
        $count = esc_html($_POST['count-box']);
    }

    if(esc_html($_POST['count-pallet'])){
        $count = esc_html($_POST['count-pallet']);
    }


    $title = 'Расчет стоимости';
    $body = '<h1>От: '.get_option( 'blogname' ).'</h1>';
    $body .= '<h3>Тема: '.$title.'</h3>';
    $body .= '<h4>Сообщение:</h4>';

    $post_array = array(
        'Имя' => $name,
        'Телефон' => $phone,
        'E-mail' => $email,
        'Маркетплейс' => $markteplace,
        'Откуда' => $from,
        'Куда' => $to,
        'Форма отгрузки' => $transporting,
        'Количество' => $count,
        'Объем' => $volume,
        'Доп. услуга' => $services,
        'Стоимость' => $price,
        'Промокод' => $promocode,
        'Koд партнёра' => $partnerID,
    );

     foreach($post_array as $key => $value) {
        if(trim(!empty($value))){
            $body .= '<p><strong>'.$key.':</strong> '.$value.'</p>';
        }
    };
   

    $body .= '<hr>';
    $body .= '<p>Это уведомление о том, что на вашем веб-сайте ('.get_option( 'blogname' ).' '.get_option( 'siteurl ' ).') была отправлена контактная форма.</p>';

    // В битру

    $get = array(
        'fields[TITLE]'  => $title . ' - ' . $name . ' | ' . $phone, 
        'fields[NAME]'  => $name, 
        'fields[PHONE][0][VALUE_TYPE]' => 'WORK',
        'fields[PHONE][0][VALUE]' => $phone, 
		'fields[EMAIL][0][VALUE_TYPE]' => 'WORK',
        'fields[EMAIL][0][VALUE]' => $email ?? null,

        'fields[SOURCE_DESCRIPTION]' => $url,
        'fields[SOURCE_ID]' => 'Заявка с сайта ' . $source,
		
        'fields[UTM_CAMPAIGN]' => $utm_campaign,
        'fields[UTM_CONTENT]' => $utm_content,
        'fields[UTM_MEDIUM]' => $utm_medium,
        'fields[UTM_SOURCE]' => $utm_source,
        'fields[UTM_TERM]' => $utm_term,

        'fields[UF_CRM_TYPEOFDELIVERY1]' => $transporting ?? null, 
        'fields[UF_CRM_PRICETEST]' => $total_price ?? null, 
        'fields[UF_CRM_NODISCOUNT]' => $no_sale_price ?? null, 
        'fields[UF_CRM_KOLLVO]' => $count ?? null, 
        'fields[UF_CRM_VOLUME1]' => $volume ?? null, 
        'fields[UF_CRM_WHEREFROM1]' => $from ?? null, 
        'fields[UF_CRM_WHERE1]' => $to ?? null, 
        'fields[UF_CRM_PARTNERID]' => $partnerID ?? null,
        'fields[UF_CRM_PROMOMPHUB]' => $promocode ?? null, 
        'fields[UF_CRM_PALLET]' => $palleta ?? null, 
        'fields[UF_CRM_NEEDTOPICK]' => $zabor_gruza ?? null, 
        'fields[UF_CRM_PALLETPALLETI]' => $palletirovanie ?? null, 
    );

    

    $hook_url = 'https://veroliki.bitrix24.ru/rest/1658/2caychpzzpe6odrm/crm.lead.add?';

    $ch = curl_init($hook_url . http_build_query($get));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HEADER, false);
    $html = curl_exec($ch);
    curl_close($ch);

    // ! В битру

    $mailResult = false;
    $mailResult = wp_mail( $multiple_to_recipients, $title, $body );

    echo json_encode(
        array(
            'result' => $mailResult,
            'curl'    => $html // Ответ от битры, использовать для дебага
        ),
    );

    die();

    // remove trxt/html so that there is no conflict
    remove_filter( 'wp_mail_content_type', 'set_html_content_type' );
}


function set_html_content_type() {
    return 'text/html';
}