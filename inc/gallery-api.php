<?php
/**
 * REST API endpoint per le cartelle Virtual Media Folders.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function ark_register_vmf_endpoint(): void {
    register_rest_route( 'arkimedia/v1', '/vmf-folders', [
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => 'ark_get_vmf_folders',
        'permission_callback' => function() {
            return current_user_can( 'edit_posts' );
        },
    ]);
}
add_action( 'rest_api_init', 'ark_register_vmf_endpoint' );

function ark_get_vmf_folders(): WP_REST_Response {
    if ( ! taxonomy_exists( 'vmfo_folder' ) ) {
        return new WP_REST_Response( [], 200 );
    }

    $terms = get_terms([
        'taxonomy'   => 'vmfo_folder',
        'hide_empty' => false,
    ]);

    if ( is_wp_error( $terms ) ) {
        return new WP_REST_Response( [], 200 );
    }

    $folders = array_map( fn( $t ) => [
        'id'    => $t->term_id,
        'name'  => $t->name,
        'count' => $t->count,
    ], $terms );

    return new WP_REST_Response( $folders, 200 );
}
