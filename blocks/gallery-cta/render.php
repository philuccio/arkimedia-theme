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

$images       = array_values( array_filter( $images, fn( $img ) => ! empty( $img['mediaUrl'] ) ) );
$inline_tags  = [ 'em' => [], 'strong' => [], 'br' => [] ];
$has_cta      = $cta_eyebrow || $cta_title || $cta_text || ( $cta_label && $cta_url );
$group        = wp_unique_id( 'gallery-cta-' );

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
            <h2 class="ark-gallery-cta__title"><?php echo wp_kses( $title, $inline_tags ); ?></h2>
        <?php endif; ?>
    </div>

    <!-- Body: griglia + CTA -->
    <?php if ( $images || $has_cta ) : ?>
    <div class="ark-gallery-cta__body container<?php echo $images && $has_cta ? '' : ' ark-gallery-cta__body--single'; ?>">

        <?php if ( $images ) : ?>
        <!-- Griglia 3x3 -->
        <div class="ark-gallery-cta__grid">
            <?php foreach ( $images as $index => $img ) :
                $url      = $img['mediaUrl'];
                $alt      = $img['mediaAlt'] ?? '';
                // Immagini salvate prima dell'ID: si risale all'allegato dall'URL
                $media_id = (int) ( $img['mediaId'] ?? 0 ) ?: attachment_url_to_postid( $url );
                $alt      = $alt ?: ( $media_id ? (string) get_post_meta( $media_id, '_wp_attachment_image_alt', true ) : '' );
                $label    = $alt ?: sprintf( __( 'Apri immagine %d', 'arkimedia' ), $index + 1 );
                $thumb    = $media_id
                    ? wp_get_attachment_image( $media_id, 'medium', false, [
                        'alt'   => $alt,
                        'sizes' => '(max-width: 1024px) 33vw, 190px',
                    ] )
                    : '';
            ?>
                <div class="ark-gallery-cta__cell">
                    <a href="<?php echo esc_url( $url ); ?>"
                       data-fancybox="<?php echo esc_attr( $group ); ?>"
                       data-caption="<?php echo esc_attr( $alt ); ?>"
                       aria-label="<?php echo esc_attr( $label ); ?>">
                        <?php if ( $thumb ) : ?>
                            <?php echo $thumb; ?>
                        <?php else : ?>
                            <img src="<?php echo esc_url( $url ); ?>"
                                 alt="<?php echo esc_attr( $alt ); ?>"
                                 loading="lazy">
                        <?php endif; ?>
                    </a>
                </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

        <?php if ( $images && $has_cta ) : ?>
        <!-- Divisore verticale -->
        <div class="ark-gallery-cta__divider" style="background:<?php echo esc_attr( $divider ); ?>"></div>
        <?php endif; ?>

        <?php if ( $has_cta ) : ?>
        <!-- CTA Panel -->
        <div class="ark-gallery-cta__cta">
            <?php if ( $cta_eyebrow ) : ?>
                <p class="ark-gallery-cta__cta-eyebrow" style="color:<?php echo esc_attr( $accent ); ?>">
                    <?php echo esc_html( $cta_eyebrow ); ?>
                </p>
            <?php endif; ?>
            <?php if ( $cta_title ) : ?>
                <h3 class="ark-gallery-cta__cta-title">
                    <?php echo wp_kses( $cta_title, $inline_tags ); ?>
                </h3>
            <?php endif; ?>
            <?php if ( $cta_text ) : ?>
                <p class="ark-gallery-cta__cta-text"><?php echo wp_kses( $cta_text, $inline_tags ); ?></p>
            <?php endif; ?>
            <?php if ( $cta_label && $cta_url ) : ?>
                <a class="ark-gallery-cta__cta-btn"
                   href="<?php echo esc_url( $cta_url ); ?>"
                   style="background:<?php echo esc_attr( $accent ); ?>;">
                    <?php echo esc_html( $cta_label ); ?>
                </a>
            <?php endif; ?>
        </div>
        <?php endif; ?>

    </div>
    <?php endif; ?>

</section>
