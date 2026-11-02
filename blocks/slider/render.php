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

ark_enqueue_slider_assets();

// Altezza — unità e funzioni CSS, senza percentuali (calcolerebbero zero)
$height = trim( $height );
if ( ! preg_match( '/^[a-z0-9.,+\-*\/()\s]+$/i', $height ) ) {
    $height = '100vh';
}

// Il loop richiede più slide di quelle visibili e non è compatibile con Cards
$per_view = is_numeric( $slides_per_view ) ? (int) $slides_per_view : 1;
$use_loop = $loop && $effect !== 'cards' && count( $slides ) > $per_view;

$position_map = [ 'top' => 'flex-start', 'center' => 'center', 'bottom' => 'flex-end' ];

// Opzioni Swiper serializzate per il JS
$swiper_opts = wp_json_encode( [
    'effect'         => $effect,
    'loop'           => $use_loop,
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

$slider_class = 'ark-slider-block';
if ( $navigation )               $slider_class .= ' ark-slider-block--arrows';
if ( $slides_per_view !== '1' || $effect === 'cards' ) $slider_class .= ' ark-slider-block--multi';
if ( $effect === 'cards' )       $slider_class .= ' ark-slider-block--cards';

$wrapper_attrs = get_block_wrapper_attributes([
    'class'              => $slider_class,
    'data-swiper-config' => esc_attr( $swiper_opts ),
    'style'              => "min-height:{$height};",
]);
?>

<div <?php echo $wrapper_attrs; ?>>
    <div class="swiper ark-slider-block__swiper">
        <div class="swiper-wrapper">
            <?php foreach ( $slides as $slide_index => $slide ) :
                $title      = $slide['title']        ?? '';
                $subtitle   = $slide['subtitle']     ?? '';
                $eyebrow    = $slide['eyebrow']      ?? '';
                $cta_label  = $slide['ctaLabel']     ?? '';
                $cta_url    = $slide['ctaUrl']       ?? '#';
                $media_id   = $slide['mediaId']      ?? 0;
                $media_url  = $slide['mediaUrl']     ?? '';
                $media_alt  = $slide['mediaAlt']     ?? '';
                $use_color  = $slide['useBgColor']   ?? false;
                $bg_color   = $slide['bgColor']      ?? '#0a0a0a';
                $overlay    = $slide['overlayColor'] ?? 'rgba(0,0,0,0.45)';
                $text_align = $slide['textAlign']    ?? 'left';
                $position   = $slide['contentPosition'] ?? 'bottom';

                // La prima immagine è il contenuto principale; la seconda serve subito al primo scorrimento
                $image_attrs = [
                    'alt'     => $media_alt,
                    'loading' => $slide_index < 2 ? 'eager' : 'lazy',
                ];
                if ( $slide_index === 0 ) $image_attrs['fetchpriority'] = 'high';

                $image_html = $media_id ? wp_get_attachment_image( $media_id, 'full', false, $image_attrs ) : '';

                $slide_style = 'align-items:' . ( $position_map[ $position ] ?? 'flex-end' ) . ';';
                if ( $use_color || ! ( $media_url || $image_html ) ) {
                    $slide_style .= "background:{$bg_color};";
                }

                $title_style    = ! empty( $slide['titleSize'] )    ? 'font-size:' . $slide['titleSize'] . ';'    : '';
                $subtitle_style = ! empty( $slide['subtitleSize'] ) ? 'font-size:' . $slide['subtitleSize'] . ';' : '';
            ?>
                <div class="swiper-slide ark-slider-block__slide ark-slider-block__slide--align-<?php echo esc_attr( $text_align ); ?>"
                     style="<?php echo esc_attr( $slide_style ); ?>">

                    <?php if ( ( $media_url || $image_html ) && ! $use_color ) : ?>
                        <figure class="ark-slider-block__bg">
                            <?php if ( $image_html ) : ?>
                                <?php echo $image_html; ?>
                            <?php else : ?>
                                <img src="<?php echo esc_url( $media_url ); ?>"
                                     alt="<?php echo esc_attr( $media_alt ); ?>"
                                     loading="<?php echo esc_attr( $image_attrs['loading'] ); ?>">
                            <?php endif; ?>
                            <div class="ark-slider-block__overlay"
                                 style="background:<?php echo esc_attr( $overlay ); ?>"></div>
                        </figure>
                    <?php endif; ?>

                    <?php $has_content = $eyebrow || $title || $subtitle || ( $cta_label && $cta_url ); ?>
                    <?php if ( $has_content ) : ?>
                    <div class="ark-slider-block__content">
                        <?php if ( $eyebrow ) : ?>
                            <p class="ark-slider-block__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
                        <?php endif; ?>
                        <?php if ( $title ) : ?>
                            <h2 class="ark-slider-block__title" style="<?php echo esc_attr( $title_style ); ?>"><?php echo wp_kses_post( $title ); ?></h2>
                        <?php endif; ?>
                        <?php if ( $subtitle ) : ?>
                            <p class="ark-slider-block__subtitle" style="<?php echo esc_attr( $subtitle_style ); ?>"><?php echo wp_kses_post( $subtitle ); ?></p>
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
