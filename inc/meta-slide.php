<?php
/**
 * Meta box campi slide.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function ark_slide_meta_box(): void {
    add_meta_box(
        'ark_slide_details',
        __( 'Dettagli slide', 'arkimedia' ),
        'ark_slide_meta_box_html',
        'slide',
        'normal',
        'high'
    );
}
add_action( 'add_meta_boxes', 'ark_slide_meta_box' );

function ark_slide_meta_box_html( WP_Post $post ): void {
    wp_nonce_field( 'ark_slide_meta', 'ark_slide_nonce' );

    $fields = [
        'slide_subtitle'   => __( 'Sottotitolo', 'arkimedia' ),
        'slide_text'       => __( 'Testo corpo', 'arkimedia' ),
        'slide_link_url'   => __( 'URL link', 'arkimedia' ),
        'slide_link_label' => __( 'Testo pulsante', 'arkimedia' ),
        'slide_overlay'    => __( 'Overlay colore (es. rgba(0,0,0,0.4))', 'arkimedia' ),
    ];

    foreach ( $fields as $key => $label ) :
        $value = esc_attr( get_post_meta( $post->ID, $key, true ) );
    ?>
        <p>
            <label for="<?php echo esc_attr( $key ); ?>">
                <strong><?php echo esc_html( $label ); ?></strong>
            </label><br>
            <input
                type="text"
                id="<?php echo esc_attr( $key ); ?>"
                name="<?php echo esc_attr( $key ); ?>"
                value="<?php echo $value; ?>"
                style="width:100%"
            >
        </p>
    <?php endforeach;
}

function ark_slide_meta_save( int $post_id ): void {
    if (
        ! isset( $_POST['ark_slide_nonce'] ) ||
        ! wp_verify_nonce(
            sanitize_text_field( wp_unslash( $_POST['ark_slide_nonce'] ) ),
            'ark_slide_meta'
        ) ||
        ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ||
        ! current_user_can( 'edit_post', $post_id )
    ) return;

    $fields = [
        'slide_subtitle',
        'slide_text',
        'slide_link_url',
        'slide_link_label',
        'slide_overlay',
    ];

    foreach ( $fields as $key ) {
        if ( isset( $_POST[ $key ] ) ) {
            update_post_meta(
                $post_id,
                $key,
                sanitize_text_field( wp_unslash( $_POST[ $key ] ) )
            );
        }
    }
}
add_action( 'save_post_slide', 'ark_slide_meta_save' );
