<?php
/**
 * Query e render slider.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

function ark_get_slider( string $group, array $args = [] ): string {

    $query = new WP_Query( [
        'post_type'      => 'slide',
        'posts_per_page' => -1,
        'orderby'        => 'menu_order',
        'order'          => 'ASC',
        'tax_query'      => [ [
            'taxonomy' => 'slider_group',
            'field'    => 'slug',
            'terms'    => sanitize_title( $group ),
        ] ],
    ] );

    if ( ! $query->have_posts() ) return '';

    $defaults = [
        'autoplay'   => true,
        'speed'      => 800,
        'delay'      => 4000,
        'loop'       => true,
        'navigation' => true,
        'pagination' => true,
        'effect'     => 'slide',
    ];
    $options = wp_parse_args( $args, $defaults );
    $data    = esc_attr( wp_json_encode( $options ) );

    ob_start();
    ?>
    <div class="swiper ark-slider" data-slider-options="<?php echo $data; ?>">
        <div class="swiper-wrapper">
            <?php while ( $query->have_posts() ) : $query->the_post();
                get_template_part( 'template-parts/slider/slide', 'item' );
            endwhile; wp_reset_postdata(); ?>
        </div>
        <?php if ( $options['navigation'] ) : ?>
            <button class="swiper-button-prev" aria-label="<?php esc_attr_e( 'Slide precedente', 'arkimedia' ); ?>"></button>
            <button class="swiper-button-next" aria-label="<?php esc_attr_e( 'Slide successiva', 'arkimedia' ); ?>"></button>
        <?php endif; ?>
        <?php if ( $options['pagination'] ) : ?>
            <div class="swiper-pagination"></div>
        <?php endif; ?>
    </div>
    <?php
    return ob_get_clean();
}
