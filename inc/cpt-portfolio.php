<?php
/**
 * Custom Post Type: portfolio
 * Tassonomia: portfolio_category
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function ark_register_portfolio_cpt(): void {

    register_post_type( 'portfolio', [
        'labels' => [
            'name'               => __( 'Portfolio', 'arkimedia' ),
            'singular_name'      => __( 'Progetto', 'arkimedia' ),
            'add_new'            => __( 'Aggiungi progetto', 'arkimedia' ),
            'add_new_item'       => __( 'Nuovo progetto', 'arkimedia' ),
            'edit_item'          => __( 'Modifica progetto', 'arkimedia' ),
            'view_item'          => __( 'Visualizza progetto', 'arkimedia' ),
            'search_items'       => __( 'Cerca progetti', 'arkimedia' ),
            'not_found'          => __( 'Nessun progetto trovato', 'arkimedia' ),
            'menu_name'          => __( 'Portfolio', 'arkimedia' ),
        ],
        'public'            => true,
        'show_ui'           => true,
        'show_in_menu'      => true,
        'show_in_rest'      => true,
        'menu_icon'         => 'dashicons-portfolio',
        'menu_position'     => 26,
        'supports'          => [ 'title', 'editor', 'thumbnail', 'excerpt', 'page-attributes' ],
        'has_archive'       => true,
        'rewrite'           => [ 'slug' => 'portfolio' ],
    ] );

    register_taxonomy( 'portfolio_category', 'portfolio', [
        'labels' => [
            'name'              => __( 'Categorie portfolio', 'arkimedia' ),
            'singular_name'     => __( 'Categoria portfolio', 'arkimedia' ),
            'add_new_item'      => __( 'Nuova categoria', 'arkimedia' ),
            'edit_item'         => __( 'Modifica categoria', 'arkimedia' ),
            'search_items'      => __( 'Cerca categorie', 'arkimedia' ),
            'all_items'         => __( 'Tutte le categorie', 'arkimedia' ),
        ],
        'hierarchical'      => true,
        'public'            => true,
        'show_ui'           => true,
        'show_in_rest'      => true,
        'show_admin_column' => true,
        'rewrite'           => [ 'slug' => 'portfolio-category' ],
    ] );
}
add_action( 'init', 'ark_register_portfolio_cpt' );
