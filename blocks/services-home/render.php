<?php
/**
 * Render blocco Servizi Home.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$eyebrow    = $attributes['eyebrow']        ?? 'SERVICES';
$title      = $attributes['title']          ?? 'OUT OF HOME';
$marquee    = $attributes['marqueeText']    ?? '';
$marquee_fs = $attributes['marqueeFontSize'] ?? 13;
$bg_color   = $attributes['bgColor']        ?? '#0a0a0a';
$text_color = $attributes['textColor']      ?? '#ffffff';
$accent     = $attributes['accentColor']    ?? '#e94560';

$cards = [];
for ( $i = 1; $i <= 4; $i++ ) {
    $cards[] = [
        'title'    => $attributes["card{$i}Title"]    ?? '',
        'text'     => $attributes["card{$i}Text"]     ?? '',
        'mediaUrl' => $attributes["card{$i}MediaUrl"] ?? '',
        'mediaAlt' => $attributes["card{$i}MediaAlt"] ?? '',
    ];
}

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'ark-services-home alignfull',
    'style' => "background:{$bg_color};color:{$text_color};width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);",
]);
?>

<section <?php echo $wrapper_attrs; ?>>

    <!-- Header -->
    <div class="ark-services-home__header container">
        <?php if ( $eyebrow ) : ?>
            <p class="ark-services-home__eyebrow" style="color:<?php echo esc_attr( $accent ); ?>"><?php echo esc_html( $eyebrow ); ?></p>
        <?php endif; ?>
        <?php if ( $title ) : ?>
            <h2 class="ark-services-home__title"><?php echo esc_html( $title ); ?></h2>
        <?php endif; ?>
    </div>

    <!-- Marquee -->
    <?php if ( $marquee ) : ?>
    <div class="ark-services-home__marquee-wrap">
        <div class="ark-services-home__marquee" style="font-size:<?php echo absint( $marquee_fs ); ?>px;">
            <span><?php echo esc_html( $marquee ); ?></span>
            <span aria-hidden="true"><?php echo esc_html( $marquee ); ?></span>
        </div>
    </div>
    <?php endif; ?>

    <!-- Cards -->
    <div class="ark-services-home__grid container">
        <?php foreach ( $cards as $card ) : ?>
        <div class="ark-services-home__card" data-stagger-item>
            <?php if ( $card['mediaUrl'] ) : ?>
                <div class="ark-services-home__card-img">
                    <img src="<?php echo esc_url( $card['mediaUrl'] ); ?>"
                         alt="<?php echo esc_attr( $card['mediaAlt'] ); ?>"
                         loading="lazy">
                </div>
            <?php endif; ?>
            <div class="ark-services-home__card-body">
                <?php if ( $card['title'] ) : ?>
                    <h3 class="ark-services-home__card-title"><?php echo esc_html( $card['title'] ); ?></h3>
                <?php endif; ?>
                <?php if ( $card['text'] ) : ?>
                    <p class="ark-services-home__card-text"><?php echo esc_html( $card['text'] ); ?></p>
                <?php endif; ?>
            </div>
        </div>
        <?php endforeach; ?>
    </div>

</section>
