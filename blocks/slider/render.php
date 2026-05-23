<?php
/**
 * Render blocco Slider.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$effect          = $attributes['effect']         ?? 'slide';
$autoplay        = $attributes['autoplay']        ?? false;
$autoplay_delay  = $attributes['autoplayDelay']   ?? 4000;
$loop            = $attributes['loop']            ?? true;
$speed           = $attributes['speed']           ?? 800;
$navigation      = $attributes['navigation']      ?? true;
$pagination      = $attributes['pagination']      ?? true;
$pagination_type = $attributes['paginationType']  ?? 'bullets';
$slides_per_view = $attributes['slidesPerView']   ?? '1';
$space_between   = $attributes['spaceBetween']    ?? 0;
$centered        = $attributes['centeredSlides']  ?? false;
$grab_cursor     = $attributes['grabCursor']      ?? true;
$height          = $attributes['sliderHeight']    ?? '100vh';
$gsap            = $attributes['gsapAnimation']   ?? true;
$slides          = $attributes['slides']          ?? [];

// Opzioni Swiper serializzate per il JS
$swiper_opts = wp_json_encode( [
    'effect'         => $effect,
    'loop'           => $loop,
    'speed'          => $speed,
    'slidesPerView'  => is_numeric( $slides_per_view ) ? (int) $slides_per_view : $slides_per_view,
    'spaceBetween'   => (int) $space_between,
    'centeredSlides' => $centered,
    'grabCursor'     => $grab_cursor,
    'gsapAnimation'  => $gsap,
    'autoplay'       => $autoplay ? [ 'delay' => (int) $autoplay_delay, 'disableOnInteraction' => false, 'pauseOnMouseEnter' => true ] : false,
    'navigation'     => $navigation,
    'pagination'     => $pagination ? [ 'type' => $pagination_type, 'clickable' => true ] : false,
] );

$wrapper_attrs = get_block_wrapper_attributes([
    'class'              => 'ark-slider-block',
    'data-swiper-config' => esc_attr( $swiper_opts ),
    'style'              => "height:{$height};",
]);
?>

<div <?php echo $wrapper_attrs; ?>>
    <div class="swiper ark-slider-block__swiper">
        <div class="swiper-wrapper">
            <?php foreach ( $slides as $slide ) :
                $title      = $slide['title']        ?? '';
                $subtitle   = $slide['subtitle']     ?? '';
                $eyebrow    = $slide['eyebrow']      ?? '';
                $cta_label  = $slide['ctaLabel']     ?? '';
                $cta_url    = $slide['ctaUrl']       ?? '#';
                $media_url  = $slide['mediaUrl']     ?? '';
                $media_alt  = $slide['mediaAlt']     ?? '';
                $use_color  = $slide['useBgColor']   ?? false;
                $bg_color   = $slide['bgColor']      ?? '#0a0a0a';
                $overlay    = $slide['overlayColor'] ?? 'rgba(0,0,0,0.45)';
                $text_align = $slide['textAlign']    ?? 'left';

                $slide_style = $use_color || ! $media_url
                    ? "background:{$bg_color};"
                    : '';
            ?>
                <div class="swiper-slide ark-slider-block__slide ark-slider-block__slide--align-<?php echo esc_attr( $text_align ); ?>"
                     style="<?php echo esc_attr( $slide_style ); ?>">

                    <?php if ( $media_url && ! $use_color ) : ?>
                        <figure class="ark-slider-block__bg" aria-hidden="true">
                            <img src="<?php echo esc_url( $media_url ); ?>"
                                 alt="<?php echo esc_attr( $media_alt ); ?>"
                                 loading="lazy">
                            <div class="ark-slider-block__overlay"
                                 style="background:<?php echo esc_attr( $overlay ); ?>"></div>
                        </figure>
                    <?php elseif ( ! $use_color ) : ?>
                        <div class="ark-slider-block__bg ark-slider-block__bg--color"
                             style="background:#0a0a0a;">
                            <div class="ark-slider-block__overlay"
                                 style="background:<?php echo esc_attr( $overlay ); ?>"></div>
                        </div>
                    <?php endif; ?>

                    <?php $has_content = $eyebrow || $title || $subtitle || ( $cta_label && $cta_url ); ?>
                    <?php if ( $has_content ) : ?>
                    <div class="ark-slider-block__content">
                        <?php if ( $eyebrow ) : ?>
                            <p class="ark-slider-block__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
                        <?php endif; ?>
                        <?php if ( $title ) : ?>
                            <h2 class="ark-slider-block__title"><?php echo wp_kses_post( $title ); ?></h2>
                        <?php endif; ?>
                        <?php if ( $subtitle ) : ?>
                            <p class="ark-slider-block__subtitle"><?php echo wp_kses_post( $subtitle ); ?></p>
                        <?php endif; ?>
                        <?php if ( $cta_label && $cta_url ) : ?>
                            <a class="ark-slider-block__cta btn"
                               href="<?php echo esc_url( $cta_url ); ?>">
                                <?php echo esc_html( $cta_label ); ?>
                            </a>
                        <?php endif; ?>
                    </div>
                    <?php endif; ?>

                </div>
            <?php endforeach; ?>
        </div>

        <?php if ( $navigation ) : ?>
            <button class="swiper-button-prev" aria-label="<?php esc_attr_e( 'Slide precedente', 'arkimedia' ); ?>"></button>
            <button class="swiper-button-next" aria-label="<?php esc_attr_e( 'Slide successiva', 'arkimedia' ); ?>"></button>
        <?php endif; ?>

        <?php if ( $pagination ) : ?>
            <div class="swiper-pagination"></div>
        <?php endif; ?>
    </div>
</div>
