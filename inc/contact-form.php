<?php
/**
 * Gestione invio form contatti.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// Massimo invii per IP nella finestra temporale
const ARK_CONTACT_MAX_SENDS = 5;
const ARK_CONTACT_WINDOW    = 10 * MINUTE_IN_SECONDS;

// Tempo ammesso tra l'ingresso nel form e l'invio
const ARK_CONTACT_MIN_TIME  = 3;
const ARK_CONTACT_MAX_TIME  = DAY_IN_SECONDS;

function ark_contact_time_sign( int $time ): string {
    return wp_hash( $time . '|ark_contact' );
}

// Nonce sempre fresco: l'HTML della pagina può arrivare dalla cache
function ark_contact_nonce(): void {
    nocache_headers();
    $time = time();
    wp_send_json_success( [
        'nonce' => wp_create_nonce( 'ark_contact_form' ),
        'time'  => $time,
        'sign'  => ark_contact_time_sign( $time ),
    ] );
}
add_action( 'wp_ajax_ark_contact_nonce',        'ark_contact_nonce' );
add_action( 'wp_ajax_nopriv_ark_contact_nonce', 'ark_contact_nonce' );

// I testi di esito sono nel blocco: gli errori non portano messaggi fissi
function ark_handle_contact_form(): void {

    if ( ! check_ajax_referer( 'ark_contact_form', 'nonce', false ) ) {
        wp_send_json_error();
    }

    // Campo trappola compilato: finto successo, nessun invio
    if ( ! empty( $_POST['website'] ) ) {
        wp_send_json_success();
    }

    // Controllo del tempo: orario firmato dal server, non falsificabile dal browser
    $start   = absint( $_POST['start'] ?? 0 );
    $sign    = sanitize_text_field( wp_unslash( $_POST['sign'] ?? '' ) );
    $elapsed = time() - $start;
    if (
        ! hash_equals( ark_contact_time_sign( $start ), $sign )
        || $elapsed < ARK_CONTACT_MIN_TIME
        || $elapsed > ARK_CONTACT_MAX_TIME
    ) {
        wp_send_json_error();
    }

    $rate_key = 'ark_contact_' . md5( sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ?? '' ) ) );
    $sends    = (int) get_transient( $rate_key );
    if ( $sends >= ARK_CONTACT_MAX_SENDS ) {
        wp_send_json_error();
    }

    $name    = sanitize_text_field( wp_unslash( $_POST['name']    ?? '' ) );
    $email   = sanitize_email( wp_unslash( $_POST['email']        ?? '' ) );
    $phone   = sanitize_text_field( wp_unslash( $_POST['phone']   ?? '' ) );
    $subject = sanitize_text_field( wp_unslash( $_POST['subject'] ?? '' ) );
    $message = sanitize_textarea_field( wp_unslash( $_POST['message'] ?? '' ) );
    $privacy = ! empty( $_POST['privacy'] );

    if ( ! $name || ! is_email( $email ) || ! $message || ! $privacy ) {
        wp_send_json_error();
    }

    set_transient( $rate_key, $sends + 1, ARK_CONTACT_WINDOW );

    $to      = get_theme_mod( 'ark_contact_email', get_option( 'admin_email' ) );
    $subject = $subject ?: sprintf( __( 'Nuovo messaggio da %s', 'arkimedia' ), $name );

    $body  = sprintf( "Nome: %s\n", $name );
    $body .= sprintf( "Email: %s\n", $email );
    if ( $phone ) $body .= sprintf( "Telefono: %s\n", $phone );
    $body .= sprintf( "\nMessaggio:\n%s", $message );

    $headers = [
        'Content-Type: text/plain; charset=UTF-8',
        sprintf( 'Reply-To: %s <%s>', $name, $email ),
    ];

    $sent = wp_mail( $to, $subject, $body, $headers );

    if ( $sent ) {
        wp_send_json_success();
    } else {
        wp_send_json_error();
    }
}
add_action( 'wp_ajax_ark_contact_form',        'ark_handle_contact_form' );
add_action( 'wp_ajax_nopriv_ark_contact_form', 'ark_handle_contact_form' );
