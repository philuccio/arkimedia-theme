<?php
/**
 * Render server-side del blocco Hero.
 *
 * @package Arkimedia
 */

$title      = $attributes['title']        ?? '';
$subtitle   = $attributes['subtitle']     ?? '';
$eyebrow    = $attributes['eyebrow']      ?? '';
$cta_label  = $attributes['ctaLabel']     ?? '';
$cta_url    = $attributes['ctaUrl']       ?? '#';
$media_url  = $attributes['mediaUrl']     ?? '';
$media_alt  = $attributes['mediaAlt']     ?? '';
$overlay    = $attributes['overlayColor'] ?? 'rgba(0,0,0,0.45)';
$text_align = $attributes['textAlign']    ?? 'left';
$min_height = $attributes['minHeight']    ?? '100vh';

$wrapper_attrs = get_block_wrapper_attributes( [
    'class' => 'ark-hero ark-hero--align-' . esc_attr( $text_align ),
    'style' => 'min-height:' . esc_attr( $min_height ) . ';',
] );
?>
<section <?php echo $wrapper_attrs; ?>>

    <?php if ( $media_url ) : ?>
        <figure class="ark-hero__bg" aria-hidden="true">
            <img
                src="<?php echo esc_url( $media_url ); ?>"
                alt="<?php echo esc_attr( $media_alt ); ?>"
                loading="eager"
                decoding="async"
            >
            <div class="ark-hero__overlay" style="background:<?php echo esc_attr( $overlay ); ?>"></div>
        </figure>
    <?php else : ?>
        <div class="ark-hero__bg ark-hero__bg--empty" aria-hidden="true">
            <div class="ark-hero__overlay" style="background:<?php echo esc_attr( $overlay ); ?>"></div>
        </div>
    <?php endif; ?>

    <div class="ark-hero__content">
        <?php if ( $eyebrow ) : ?>
            <p class="ark-hero__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
        <?php endif; ?>
        <?php if ( $title ) : ?>
            <h1 class="ark-hero__title"><?php echo wp_kses_post( $title ); ?></h1>
        <?php endif; ?>
        <?php if ( $subtitle ) : ?>
            <p class="ark-hero__subtitle"><?php echo wp_kses_post( $subtitle ); ?></p>
        <?php endif; ?>
        <?php if ( $cta_label && $cta_url ) : ?>
            <a class="ark-hero__cta btn" href="<?php echo esc_url( $cta_url ); ?>">
                <?php echo esc_html( $cta_label ); ?>
            </a>
        <?php endif; ?>
    </div>

</section>
