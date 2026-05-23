<?php
/**
 * Render blocco Gallery + CTA.
 *
 * @package Arkimedia
 */

$eyebrow      = $attributes['eyebrow']      ?? 'VISUAL ARCHIVE';
$title        = $attributes['title']        ?? 'Gallery';
$cta_eyebrow  = $attributes['ctaEyebrow']  ?? 'STAY IN TOUCH';
$cta_title    = $attributes['ctaTitle']     ?? "Let's create something <em>extraordinary</em> together";
$cta_text     = $attributes['ctaText']      ?? '';
$cta_label    = $attributes['ctaLabel']     ?? 'GET IN TOUCH';
$cta_url      = $attributes['ctaUrl']       ?? '#';
$bg_color     = $attributes['bgColor']      ?? '#0a0a0a';
$text_color   = $attributes['textColor']    ?? '#ffffff';
$accent       = $attributes['accentColor']  ?? '#e94560';
$divider      = $attributes['dividerColor'] ?? '#e94560';
$images       = $attributes['images']       ?? [];

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'ark-gallery-cta alignfull',
    'style' => "background:{$bg_color};color:{$text_color};width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);",
]);
?>

<section <?php echo $wrapper_attrs; ?>>

    <!-- Header -->
    <div class="ark-gallery-cta__header container">
        <?php if ( $eyebrow ) : ?>
            <p class="ark-gallery-cta__eyebrow" style="color:<?php echo esc_attr( $accent ); ?>">
                <?php echo esc_html( $eyebrow ); ?>
            </p>
        <?php endif; ?>
        <?php if ( $title ) : ?>
            <h2 class="ark-gallery-cta__title"><?php echo esc_html( $title ); ?></h2>
        <?php endif; ?>
    </div>

    <!-- Body: griglia + CTA -->
    <div class="ark-gallery-cta__body container">

        <!-- Griglia 3x3 -->
        <div class="ark-gallery-cta__grid">
            <?php foreach ( $images as $img ) :
                $url = $img['mediaUrl'] ?? '';
                $alt = $img['mediaAlt'] ?? '';
            ?>
                <div class="ark-gallery-cta__cell">
                    <?php if ( $url ) : ?>
                        <a href="<?php echo esc_url( $url ); ?>"
                           data-fancybox="gallery-cta"
                           data-caption="<?php echo esc_attr( $alt ); ?>">
                            <img src="<?php echo esc_url( $url ); ?>"
                                 alt="<?php echo esc_attr( $alt ); ?>"
                                 loading="lazy">
                        </a>
                    <?php else : ?>
                        <div class="ark-gallery-cta__cell--empty"></div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>

        <!-- Divisore verticale -->
        <div class="ark-gallery-cta__divider" style="background:<?php echo esc_attr( $divider ); ?>"></div>

        <!-- CTA Panel -->
        <div class="ark-gallery-cta__cta">
            <?php if ( $cta_eyebrow ) : ?>
                <p class="ark-gallery-cta__cta-eyebrow" style="color:<?php echo esc_attr( $accent ); ?>">
                    <?php echo esc_html( $cta_eyebrow ); ?>
                </p>
            <?php endif; ?>
            <?php if ( $cta_title ) : ?>
                <h3 class="ark-gallery-cta__cta-title">
                    <?php echo wp_kses( $cta_title, [ 'em' => [], 'strong' => [], 'br' => [] ] ); ?>
                </h3>
            <?php endif; ?>
            <?php if ( $cta_text ) : ?>
                <p class="ark-gallery-cta__cta-text"><?php echo esc_html( $cta_text ); ?></p>
            <?php endif; ?>
            <?php if ( $cta_label && $cta_url ) : ?>
                <a class="ark-gallery-cta__cta-btn"
                   href="<?php echo esc_url( $cta_url ); ?>"
                   style="background:<?php echo esc_attr( $accent ); ?>;">
                    <?php echo esc_html( $cta_label ); ?>
                </a>
            <?php endif; ?>
        </div>

    </div>

</section>
