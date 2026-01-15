<?php
/**
 * Import script for 'Winkels' Custom Post Type from CSV.
 *
 * Usage:
 * 1. Place this file in the root of your WordPress installation (or adjust the path to wp-load.php).
 * 2. Place your CSV file named 'winkels.csv' in the same directory.
 * 3. Run via command line: php import_winkels.php
 *    OR via browser (only if you are logged in as admin): https://your-site.com/import_winkels.php
 */

// 1. Bootstrap WordPress
// Try to find wp-load.php relative to this file.
// If this file is in wp-content/themes/child-theme/, we go up 3 levels.
$possible_paths = [
    dirname(__FILE__) . '/wp-load.php',            // If in WP root
    dirname(__FILE__) . '/../../../wp-load.php',   // If in child theme
    dirname(__FILE__) . '/../../../../wp-load.php' // Just in case
];

$wp_load_path = false;
foreach ($possible_paths as $path) {
    if (file_exists($path)) {
        $wp_load_path = $path;
        break;
    }
}

if (!$wp_load_path) {
    die("Error: Could not find wp-load.php. Please place this script in your WordPress root directory or adjust the path in the script.\n");
}

require_once($wp_load_path);

// 2. Security Check (if accessed via web)
if (php_sapi_name() !== 'cli') {
    if (!is_user_logged_in() || !current_user_can('manage_options')) {
        die('Access denied. You must be an administrator to run this script.');
    }
    echo '<pre>'; // Pre-format output for browser
}

echo "Starting import...\n";

// 3. Open CSV File
$csv_file = dirname(__FILE__) . '/winkels.csv';
if (!file_exists($csv_file)) {
    die("Error: CSV file not found at $csv_file\n");
}

// Auto-detect delimiter (comma or semicolon)
$handle = fopen($csv_file, 'r');
$first_line = fgets($handle);
rewind($handle);
$delimiter = (strpos($first_line, ';') !== false) ? ';' : ',';
echo "Detected delimiter: '$delimiter'\n";

// Read Header
$header = fgetcsv($handle, 0, $delimiter);
if (!$header) {
    die("Error: Could not read CSV header.\n");
}

// Normalize header to lowercase and trim
$header = array_map(function($h) {
    return strtolower(trim($h));
}, $header);

// Map CSV columns to internal keys
// Expected columns: titel, adres, postcode_plaats, telefoon, online_aanbod_url, bezoek_plannen_url
$column_map = array_flip($header);

// Check required columns
if (!isset($column_map['titel'])) {
    die("Error: CSV must have a 'titel' column.\n");
}

$count_imported = 0;
$count_updated = 0;
$count_skipped = 0;

while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
    // Combine header with row data for easier access
    // Handle case where row length doesn't match header length
    if (count($row) < count($header)) {
        $row = array_pad($row, count($header), '');
    }
    $data = array_combine($header, array_slice($row, 0, count($header)));

    $title = trim($data['titel']);
    if (empty($title)) {
        echo "Skipping row with empty title.\n";
        $count_skipped++;
        continue;
    }

    echo "Processing: $title... ";

    // Check if post exists
    $existing_post = get_page_by_title($title, OBJECT, 'winkels');

    $post_id = 0;
    $is_new = false;

    if ($existing_post) {
        $post_id = $existing_post->ID;
        echo "Found existing (ID: $post_id). Updating... ";
        $count_updated++;
    } else {
        // Create new post
        $post_data = array(
            'post_title'    => $title,
            'post_type'     => 'winkels',
            'post_status'   => 'publish',
        );
        $post_id = wp_insert_post($post_data);
        if (is_wp_error($post_id)) {
            echo "Error creating post: " . $post_id->get_error_message() . "\n";
            continue;
        }
        echo "Created new (ID: $post_id). ";
        $is_new = true;
        $count_imported++;
    }

    // Update ACF Fields
    // Define mapping from CSV column to ACF field key/name
    $acf_fields = [
        'adres' => 'adres',
        'postcode_plaats' => 'postcode_plaats',
        'telefoon' => 'telefoon',
        'online_aanbod_url' => 'online_aanbod_url',
        'bezoek_plannen_url' => 'bezoek_plannen_url'
    ];

    foreach ($acf_fields as $csv_col => $acf_key) {
        if (isset($data[$csv_col])) {
            update_field($acf_key, trim($data[$csv_col]), $post_id);
        }
    }

    echo "Done.\n";
}

fclose($handle);

echo "\nImport completed.\n";
echo "Created: $count_imported\n";
echo "Updated: $count_updated\n";
echo "Skipped: $count_skipped\n";

if (php_sapi_name() !== 'cli') {
    echo '</pre>';
}
