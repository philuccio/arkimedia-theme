<?php
/**
 * Custom Post Type: slide
 * Tassonomia: slider_group
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function ark_register_slider_cpt(): void {

    register_post_type( 'slide', [
        'labels' => [
            'name'          => __( 'Slider', 'arkimedia' ),
            'singular_name' => __( 'Slide', 'arkimedia' ),
            'add_new'       => __( 'Aggiungi slide', 'arkimedia' ),
            'add_new_item'  => __( 'Nuova slide', 'arkimedia' ),
            'edit_item'     => __( 'Modifica slide', 'arkimedia' ),
            'view_item'     => __( 'Visualizza slide', 'arkimedia' ),
            'search_items'  => __( 'Cerca slide', 'arkimedia' ),
            'not_found'     => __( 'Nessuna slide trovata', 'arkimedia' ),
            'menu_name'     => __( 'Slider', 'arkimedia' ),
        ],
        'public'            => false,
        'show_ui'           => true,
        'show_in_menu'      => true,
        'show_in_rest'      => true,
        'menu_icon'         => 'dashicons-images-alt2',
        'menu_position'     => 25,
        'supports'          => [ 'title', 'thumbnail', 'page-attributes' ],
        'rewrite'           => false,
    ] );

    register_taxonomy( 'slider_group', 'slide', [
        'labels' => [
            'name'          => __( 'Gruppi slider', 'arkimedia' ),
            'singular_name' => __( 'Gruppo slider', 'arkimedia' ),
            'add_new_item'  => __( 'Nuovo gruppo', 'arkimedia' ),
            'edit_item'     => __( 'Modifica gruppo', 'arkimedia' ),
        ],
        'hierarchical'      => false,
        'public'            => false,
        'show_ui'           => true,
        'show_in_rest'      => true,
        'show_admin_column' => true,
        'rewrite'           => false,
    ] );
}
add_action( 'init', 'ark_register_slider_cpt' );
