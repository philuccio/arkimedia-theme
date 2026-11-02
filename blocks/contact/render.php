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
$privacy_url    = ( $attributes['privacyUrl'] ?? '' ) ?: ( get_privacy_policy_url() ?: home_url( '/privacy/' ) );
$name_label     = $attributes['nameLabel']          ?? 'Nome *';
$name_ph        = $attributes['namePlaceholder']    ?? 'Il tuo nome';
$email_label    = $attributes['emailLabel']         ?? 'Email *';
$email_ph       = $attributes['emailPlaceholder']   ?? 'La tua email';
$phone_label    = $attributes['phoneLabel']         ?? 'Telefono';
$phone_ph       = $attributes['phonePlaceholder']   ?? 'Il tuo numero';
$subject_label  = $attributes['subjectLabel']       ?? 'Oggetto';
$subject_ph     = $attributes['subjectPlaceholder'] ?? 'Di cosa vuoi parlarci?';
$message_label  = $attributes['messageLabel']       ?? 'Messaggio *';
$message_ph     = $attributes['messagePlaceholder'] ?? 'Raccontaci il tuo progetto...';
$hours_title    = $attributes['hoursTitle']         ?? 'Orari';
$contacts       = $attributes['contacts']       ?? [];
$hours          = $attributes['hours']          ?? [];

// ID univoci: più form nella stessa pagina
$uid = wp_unique_id( 'ark-contact-' );

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
                        <?php echo esc_html( $hours_title ); ?>
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
                  style="--ark-contact-accent:<?php echo esc_attr( $accent ); ?>;"
                  data-success="<?php echo esc_attr( $success_msg ); ?>"
                  data-error="<?php echo esc_attr( $error_msg ); ?>">

                <!-- Campo trappola: nascosto ai visitatori, i bot lo compilano -->
                <div class="ark-contact__hp" aria-hidden="true">
                    <label for="<?php echo esc_attr( $uid ); ?>-website">Website</label>
                    <input type="text" id="<?php echo esc_attr( $uid ); ?>-website" name="ark_website" tabindex="-1" autocomplete="off">
                </div>

                <div class="ark-contact__form-row">
                    <div class="ark-contact__field">
                        <label for="<?php echo esc_attr( $uid ); ?>-name"><?php echo esc_html( $name_label ); ?></label>
                        <input type="text" id="<?php echo esc_attr( $uid ); ?>-name" name="ark_name" required
                               placeholder="<?php echo esc_attr( $name_ph ); ?>"
                               style="background:<?php echo esc_attr( $input_bg ); ?>;border-color:<?php echo esc_attr( $input_border ); ?>;color:<?php echo esc_attr( $text_color ); ?>;">
                    </div>
                    <div class="ark-contact__field">
                        <label for="<?php echo esc_attr( $uid ); ?>-email"><?php echo esc_html( $email_label ); ?></label>
                        <input type="email" id="<?php echo esc_attr( $uid ); ?>-email" name="ark_email" required
                               placeholder="<?php echo esc_attr( $email_ph ); ?>"
                               style="background:<?php echo esc_attr( $input_bg ); ?>;border-color:<?php echo esc_attr( $input_border ); ?>;color:<?php echo esc_attr( $text_color ); ?>;">
                    </div>
                </div>

                <?php if ( $show_phone ) : ?>
                <div class="ark-contact__field">
                    <label for="<?php echo esc_attr( $uid ); ?>-phone"><?php echo esc_html( $phone_label ); ?></label>
                    <input type="tel" id="<?php echo esc_attr( $uid ); ?>-phone" name="ark_phone"
                           placeholder="<?php echo esc_attr( $phone_ph ); ?>"
                           style="background:<?php echo esc_attr( $input_bg ); ?>;border-color:<?php echo esc_attr( $input_border ); ?>;color:<?php echo esc_attr( $text_color ); ?>;">
                </div>
                <?php endif; ?>

                <?php if ( $show_subject ) : ?>
                <div class="ark-contact__field">
                    <label for="<?php echo esc_attr( $uid ); ?>-subject"><?php echo esc_html( $subject_label ); ?></label>
                    <input type="text" id="<?php echo esc_attr( $uid ); ?>-subject" name="ark_subject"
                           placeholder="<?php echo esc_attr( $subject_ph ); ?>"
                           style="background:<?php echo esc_attr( $input_bg ); ?>;border-color:<?php echo esc_attr( $input_border ); ?>;color:<?php echo esc_attr( $text_color ); ?>;">
                </div>
                <?php endif; ?>

                <div class="ark-contact__field">
                    <label for="<?php echo esc_attr( $uid ); ?>-message"><?php echo esc_html( $message_label ); ?></label>
                    <textarea id="<?php echo esc_attr( $uid ); ?>-message" name="ark_message" required rows="6"
                              placeholder="<?php echo esc_attr( $message_ph ); ?>"
                              style="background:<?php echo esc_attr( $input_bg ); ?>;border-color:<?php echo esc_attr( $input_border ); ?>;color:<?php echo esc_attr( $text_color ); ?>;"></textarea>
                </div>

                <div class="ark-contact__privacy">
                    <input type="checkbox" id="<?php echo esc_attr( $uid ); ?>-privacy" name="ark_privacy" required>
                    <label for="<?php echo esc_attr( $uid ); ?>-privacy">
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
