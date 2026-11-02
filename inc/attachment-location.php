<?php
/**
 * Campi Città e Indirizzo sulle immagini della Media Library.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Restituisce città e indirizzo salvati su un'immagine.
 *
 * @return array{city: string, address: string}
 */
function ark_get_attachment_location( int $attachment_id ): array {
    return [
        'city'    => (string) get_post_meta( $attachment_id, '_ark_city', true ),
        'address' => (string) get_post_meta( $attachment_id, '_ark_address', true ),
    ];
}

function ark_attachment_location_fields( array $fields, WP_Post $post ): array {
    if ( ! wp_attachment_is_image( $post ) ) {
        return $fields;
    }

    $location = ark_get_attachment_location( $post->ID );

    $fields['ark_city'] = [
        'label' => __( 'Città', 'arkimedia' ),
        'input' => 'text',
        'value' => $location['city'],
    ];
    $fields['ark_address'] = [
        'label' => __( 'Indirizzo', 'arkimedia' ),
        'input' => 'text',
        'value' => $location['address'],
    ];

    return $fields;
}
add_filter( 'attachment_fields_to_edit', 'ark_attachment_location_fields', 10, 2 );

function ark_attachment_location_save( array $post, array $attachment ): array {
    $meta_keys = [
        'ark_city'    => '_ark_city',
        'ark_address' => '_ark_address',
    ];

    foreach ( $meta_keys as $field => $meta_key ) {
        if ( isset( $attachment[ $field ] ) ) {
            update_post_meta( $post['ID'], $meta_key, sanitize_text_field( $attachment[ $field ] ) );
        }
    }

    return $post;
}
add_filter( 'attachment_fields_to_save', 'ark_attachment_location_save', 10, 2 );
