<?php 

add_action( 'wp_enqueue_scripts', 'salient_child_enqueue_styles', 100);

function salient_child_enqueue_styles() {
		
		$nectar_theme_version = nectar_get_theme_version();
		wp_enqueue_style( 'salient-child-style', get_stylesheet_directory_uri() . '/style.css', '', $nectar_theme_version );
		
    if ( is_rtl() ) {
   		wp_enqueue_style(  'salient-rtl',  get_template_directory_uri(). '/rtl.css', array(), '1', 'screen' );
		}
}



// 1) Openingstijden widget: "Vandaag", nu open/gesloten + weekoverzicht
function wbu_opening_widget() {
    // Tijdzone NL
    date_default_timezone_set('Europe/Amsterdam');

    $rows = get_field('openingstijden');
    if (empty($rows) || !is_array($rows)) {
        return '';
    }

    // Huidige dag in het Nederlands (maandag, dinsdag, ...)
    $dagen_map = array(
        'monday'    => 'maandag',
        'tuesday'   => 'dinsdag',
        'wednesday' => 'woensdag',
        'thursday'  => 'donderdag',
        'friday'    => 'vrijdag',
        'saturday'  => 'zaterdag',
        'sunday'    => 'zondag',
    );

    $now_day_en  = strtolower(date('l'));
    $now_day_nl  = isset($dagen_map[$now_day_en]) ? $dagen_map[$now_day_en] : '';
    $now_time    = date('H:i');

    $status_line = '';
    $today_row   = null;

    // Vind de rij van vandaag
    foreach ($rows as $row) {
        $dag   = strtolower(trim($row['dag']));
        $tijden_raw = trim($row['tijden']);

        if ($dag !== $now_day_nl) {
            continue;
        }

        $today_row = $row;

        // Gesloten? (veld leeg of bijv. "Gesloten")
        if ($tijden_raw === '' || stripos($tijden_raw, 'gesloten') !== false) {
            $status_line = '<span class="wbu-status closed">Vandaag gesloten</span>';
            break;
        }

        // "09:30 – 18:00" of "09:30 - 18:00"
        $tijden_clean = str_replace('–', '-', $tijden_raw);
        $parts = explode('-', $tijden_clean);
        if (count($parts) !== 2) {
            $status_line = '';
            break;
        }

        $start = trim($parts[0]);
        $end   = trim($parts[1]);

        // Vergelijk tijden (werkt met 24u notatie)
        if ($now_time >= $start && $now_time <= $end) {
            $status_line = '<span class="wbu-status open">Nu open</span> – sluit om ' . esc_html($end) . '';
        } else {
            $status_line = '<span class="wbu-status closed">Nu gesloten</span> – opent om ' . esc_html($start) . '';
        }

        break;
    }

    // HTML opbouwen
    ob_start(); ?>
    <div class="wbu-opening-widget">
        <div class="wbu-opening-header">
            <span class="wbu-opening-today">Vandaag</span>
            <?php if ($status_line) : ?>
                <span class="wbu-opening-status"><?php echo $status_line; ?></span>
            <?php endif; ?>
            <?php if (!empty($today_row['tijden'])) : ?>
                <span class="wbu-opening-today-hours"><?php echo esc_html($today_row['tijden']); ?></span>
            <?php endif; ?>
        </div>

        <ul class="wbu-opening-list">
            <?php foreach ($rows as $row) : ?>
                <li class="<?php echo (strtolower(trim($row['dag'])) === $now_day_nl) ? 'is-today' : ''; ?>">
                    <span class="wbu-day"><?php echo esc_html($row['dag']); ?></span>
                    <span class="wbu-hours"><?php echo esc_html($row['tijden']); ?></span>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
    <?php

    return ob_get_clean();
}
add_shortcode('wbu_opening_widget', 'wbu_opening_widget');

// 2) Google Maps kaartje op basis van adres + postcode_plaats
function wbu_winkel_map() {
    $adres   = get_field('adres');
    $plaats  = get_field('postcode_plaats');

    if (!$adres && !$plaats) {
        return '';
    }

    $query = urlencode(trim($adres . ', ' . $plaats));

    $iframe = '<div class="wbu-map-wrap">
        <iframe 
            width="100%" 
            height="250" 
            style="border:0; border-radius:12px;" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=' . $query . '&output=embed">
        </iframe>
    </div>';

    return $iframe;
}
add_shortcode('wbu_winkel_map', 'wbu_winkel_map');

// Simpele shortcode om ACF-velden veilig uit te lezen: [wbu_field name="telefoon"]
function wbu_acf_field_shortcode( $atts ) {
    $atts = shortcode_atts(
        array(
            'name'     => '',
            'fallback' => '',
        ),
        $atts,
        'wbu_field'
    );

    if ( empty( $atts['name'] ) ) {
        return '';
    }

    // Haal de waarde uit ACF voor het huidige bericht (winkel)
    $value = get_field( $atts['name'] );

    if ( empty( $value ) ) {
        return $atts['fallback'];
    }

    // Als het een array is (bijv. select), maak er string van
    if ( is_array( $value ) ) {
        $value = implode( ', ', $value );
    }

    return esc_html( $value );
}
add_shortcode( 'wbu_field', 'wbu_acf_field_shortcode' );