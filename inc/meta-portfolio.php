<?php
/**
 * Meta box: dettagli progetto portfolio.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function ark_portfolio_meta_box(): void {
    add_meta_box(
        'ark_portfolio_details',
        __( 'Dettagli progetto', 'arkimedia' ),
        'ark_portfolio_meta_box_html',
        'portfolio',
        'normal',
        'high'
    );
}
add_action( 'add_meta_boxes', 'ark_portfolio_meta_box' );

function ark_portfolio_meta_box_html( WP_Post $post ): void {
    wp_nonce_field( 'ark_portfolio_meta', 'ark_portfolio_nonce' );

    $fields = [
        'portfolio_client'   => __( 'Cliente', 'arkimedia' ),
        'portfolio_year'     => __( 'Anno', 'arkimedia' ),
        'portfolio_role'     => __( 'Ruolo / Servizio', 'arkimedia' ),
        'portfolio_url'      => __( 'URL progetto (esterno)', 'arkimedia' ),
        'portfolio_duration' => __( 'Durata progetto', 'arkimedia' ),
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

function ark_portfolio_meta_save( int $post_id ): void {
    if (
        ! isset( $_POST['ark_portfolio_nonce'] ) ||
        ! wp_verify_nonce(
            sanitize_text_field( wp_unslash( $_POST['ark_portfolio_nonce'] ) ),
            'ark_portfolio_meta'
        ) ||
        ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ||
        ! current_user_can( 'edit_post', $post_id )
    ) return;

    $fields = [
        'portfolio_client',
        'portfolio_year',
        'portfolio_role',
        'portfolio_url',
        'portfolio_duration',
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
add_action( 'save_post_portfolio', 'ark_portfolio_meta_save' );
