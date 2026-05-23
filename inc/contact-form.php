<?php
/**
 * Gestione invio form contatti.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function ark_handle_contact_form(): void {

    if ( ! check_ajax_referer( 'ark_contact_form', 'nonce', false ) ) {
        wp_send_json_error( [ 'message' => __( 'Richiesta non valida.', 'arkimedia' ) ] );
    }

    $name    = sanitize_text_field( wp_unslash( $_POST['name']    ?? '' ) );
    $email   = sanitize_email( wp_unslash( $_POST['email']        ?? '' ) );
    $phone   = sanitize_text_field( wp_unslash( $_POST['phone']   ?? '' ) );
    $subject = sanitize_text_field( wp_unslash( $_POST['subject'] ?? '' ) );
    $message = sanitize_textarea_field( wp_unslash( $_POST['message'] ?? '' ) );

    if ( ! $name || ! $email || ! $message ) {
        wp_send_json_error( [ 'message' => __( 'Compila tutti i campi obbligatori.', 'arkimedia' ) ] );
    }

    if ( ! is_email( $email ) ) {
        wp_send_json_error( [ 'message' => __( 'Email non valida.', 'arkimedia' ) ] );
    }

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
        wp_send_json_success( [ 'message' => __( 'Messaggio inviato!', 'arkimedia' ) ] );
    } else {
        wp_send_json_error( [ 'message' => __( 'Errore nell\'invio. Riprova.', 'arkimedia' ) ] );
    }
}
add_action( 'wp_ajax_ark_contact_form',        'ark_handle_contact_form' );
add_action( 'wp_ajax_nopriv_ark_contact_form', 'ark_handle_contact_form' );
