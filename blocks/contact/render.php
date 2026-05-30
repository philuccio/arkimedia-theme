<?php
/**
 * Render blocco Contact Section.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$eyebrow        = $attributes['eyebrow']        ?? 'CONTATTI';
$title          = $attributes['title']          ?? 'Parliamo del tuo progetto';
$intro          = $attributes['intro']          ?? '';
$bg_color       = $attributes['bgColor']        ?? '#0a0a0a';
$text_color     = $attributes['textColor']      ?? '#ffffff';
$accent         = $attributes['accentColor']    ?? '#e94560';
$input_bg       = $attributes['inputBg']        ?? 'rgba(255,255,255,0.05)';
$input_border   = $attributes['inputBorder']    ?? 'rgba(255,255,255,0.15)';
$col_layout     = $attributes['columnLayout']   ?? '50-50';
$show_phone     = $attributes['showPhone']      ?? true;
$show_subject   = $attributes['showSubject']    ?? true;
$show_hours     = $attributes['showHours']      ?? false;
$btn_label      = $attributes['btnLabel']       ?? 'Invia messaggio';
$success_msg    = $attributes['successMessage'] ?? 'Messaggio inviato!';
$error_msg      = $attributes['errorMessage']   ?? 'Errore nell\'invio.';
$privacy_text   = $attributes['privacyText']    ?? 'Ho letto e accetto la';
$privacy_label  = $attributes['privacyLabel']   ?? 'Privacy Policy';
$privacy_url    = $attributes['privacyUrl']     ?? '/privacy-policy';
$contacts       = $attributes['contacts']       ?? [];
$hours          = $attributes['hours']          ?? [];

// Larghezze colonne
$col_widths = [
    '50-50' => [ '50%', '50%' ],
    '40-60' => [ '40%', '60%' ],
    '60-40' => [ '60%', '40%' ],
];
[ $col_left, $col_right ] = $col_widths[ $col_layout ] ?? [ '50%', '50%' ];

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'ark-contact alignfull',
    'style' => "background:{$bg_color};color:{$text_color};width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);",
]);
?>

<section <?php echo $wrapper_attrs; ?>>
    <div class="ark-contact__inner container">

        <!-- Colonna sinistra -->
        <div class="ark-contact__info" style="flex:1 1 <?php echo esc_attr( $col_left ); ?>;min-width:0;box-sizing:border-box;">

            <?php if ( $eyebrow ) : ?>
                <p class="ark-contact__eyebrow" style="color:<?php echo esc_attr( $accent ); ?>">
                    <?php echo esc_html( $eyebrow ); ?>
                </p>
            <?php endif; ?>

            <h2 class="ark-contact__title"><?php echo esc_html( $title ); ?></h2>

            <?php if ( $intro ) : ?>
                <p class="ark-contact__intro"><?php echo esc_html( $intro ); ?></p>
            <?php endif; ?>

            <!-- Lista contatti -->
            <?php if ( ! empty( $contacts ) ) : ?>
                <ul class="ark-contact__list">
                    <?php foreach ( $contacts as $item ) :
                        $icon  = $item['icon']  ?? '';
                        $label = $item['label'] ?? '';
                        $value = $item['value'] ?? '';
                        $url   = $item['url']   ?? '';
                    ?>
                        <li class="ark-contact__item">
                            <?php if ( $icon ) : ?>
                                <span class="ark-contact__icon" aria-hidden="true"><?php echo esc_html( $icon ); ?></span>
                            <?php endif; ?>
                            <div class="ark-contact__item-content">
                                <span class="ark-contact__item-label"><?php echo esc_html( $label ); ?></span>
                                <?php if ( $url ) : ?>
                                    <a class="ark-contact__item-value" href="<?php echo esc_url( $url ); ?>">
                                        <?php echo esc_html( $value ); ?>
                                    </a>
                                <?php else : ?>
                                    <span class="ark-contact__item-value"><?php echo esc_html( $value ); ?></span>
                                <?php endif; ?>
                            </div>
                        </li>
                    <?php endforeach; ?>
                </ul>
            <?php endif; ?>

            <!-- Orari -->
            <?php if ( $show_hours && ! empty( $hours ) ) : ?>
                <div class="ark-contact__hours">
                    <p class="ark-contact__hours-title" style="color:<?php echo esc_attr( $accent ); ?>">
                        <?php esc_html_e( 'Orari', 'arkimedia' ); ?>
                    </p>
                    <ul class="ark-contact__hours-list">
                        <?php foreach ( $hours as $h ) : ?>
                            <li>
                                <span><?php echo esc_html( $h['days'] ?? '' ); ?></span>
                                <span><?php echo esc_html( $h['time'] ?? '' ); ?></span>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>

        </div>

        <!-- Colonna destra — Form -->
        <div class="ark-contact__form-wrap" style="flex:1 1 <?php echo esc_attr( $col_right ); ?>;min-width:0;box-sizing:border-box;">

            <form class="ark-contact__form"
                  data-success="<?php echo esc_attr( $success_msg ); ?>"
                  data-error="<?php echo esc_attr( $error_msg ); ?>">

                <?php wp_nonce_field( 'ark_contact_form', 'ark_contact_nonce' ); ?>

                <div class="ark-contact__form-row">
                    <div class="ark-contact__field">
                        <label for="ark-name"><?php esc_html_e( 'Nome *', 'arkimedia' ); ?></label>
                        <input type="text" id="ark-name" name="ark_name" required
                               placeholder="<?php esc_attr_e( 'Il tuo nome', 'arkimedia' ); ?>"
                               style="background:<?php echo esc_attr( $input_bg ); ?>;border-color:<?php echo esc_attr( $input_border ); ?>;color:<?php echo esc_attr( $text_color ); ?>;">
                    </div>
                    <div class="ark-contact__field">
                        <label for="ark-email"><?php esc_html_e( 'Email *', 'arkimedia' ); ?></label>
                        <input type="email" id="ark-email" name="ark_email" required
                               placeholder="<?php esc_attr_e( 'La tua email', 'arkimedia' ); ?>"
                               style="background:<?php echo esc_attr( $input_bg ); ?>;border-color:<?php echo esc_attr( $input_border ); ?>;color:<?php echo esc_attr( $text_color ); ?>;">
                    </div>
                </div>

                <?php if ( $show_phone ) : ?>
                <div class="ark-contact__field">
                    <label for="ark-phone"><?php esc_html_e( 'Telefono', 'arkimedia' ); ?></label>
                    <input type="tel" id="ark-phone" name="ark_phone"
                           placeholder="<?php esc_attr_e( 'Il tuo numero', 'arkimedia' ); ?>"
                           style="background:<?php echo esc_attr( $input_bg ); ?>;border-color:<?php echo esc_attr( $input_border ); ?>;color:<?php echo esc_attr( $text_color ); ?>;">
                </div>
                <?php endif; ?>

                <?php if ( $show_subject ) : ?>
                <div class="ark-contact__field">
                    <label for="ark-subject"><?php esc_html_e( 'Oggetto', 'arkimedia' ); ?></label>
                    <input type="text" id="ark-subject" name="ark_subject"
                           placeholder="<?php esc_attr_e( 'Di cosa vuoi parlarci?', 'arkimedia' ); ?>"
                           style="background:<?php echo esc_attr( $input_bg ); ?>;border-color:<?php echo esc_attr( $input_border ); ?>;color:<?php echo esc_attr( $text_color ); ?>;">
                </div>
                <?php endif; ?>

                <div class="ark-contact__field">
                    <label for="ark-message"><?php esc_html_e( 'Messaggio *', 'arkimedia' ); ?></label>
                    <textarea id="ark-message" name="ark_message" required rows="6"
                              placeholder="<?php esc_attr_e( 'Raccontaci il tuo progetto...', 'arkimedia' ); ?>"
                              style="background:<?php echo esc_attr( $input_bg ); ?>;border-color:<?php echo esc_attr( $input_border ); ?>;color:<?php echo esc_attr( $text_color ); ?>;"></textarea>
                </div>

                <div class="ark-contact__privacy">
                    <input type="checkbox" id="ark-privacy" name="ark_privacy" required>
                    <label for="ark-privacy">
                        <?php echo esc_html( $privacy_text ); ?>
                        <a href="<?php echo esc_url( $privacy_url ); ?>" target="_blank" rel="noopener"
                           style="color:<?php echo esc_attr( $accent ); ?>">
                            <?php echo esc_html( $privacy_label ); ?>
                        </a>
                    </label>
                </div>

                <div class="ark-contact__feedback" role="alert" aria-live="polite"></div>

                <button type="submit" class="ark-contact__submit"
                        style="background:<?php echo esc_attr( $accent ); ?>;">
                    <span class="ark-contact__submit-label"><?php echo esc_html( $btn_label ); ?></span>
                    <span class="ark-contact__submit-spinner" aria-hidden="true"></span>
                </button>

            </form>

        </div>

    </div>
</section>
