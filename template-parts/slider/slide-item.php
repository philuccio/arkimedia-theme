<?php
/**
 * Template part: singola slide.
 *
 * @package Arkimedia
 */

$subtitle  = get_post_meta( get_the_ID(), 'slide_subtitle',   true );
$text      = get_post_meta( get_the_ID(), 'slide_text',       true );
$link_url  = get_post_meta( get_the_ID(), 'slide_link_url',   true );
$link_lbl  = get_post_meta( get_the_ID(), 'slide_link_label', true );
$overlay   = get_post_meta( get_the_ID(), 'slide_overlay',    true );
?>
<div class="swiper-slide slide">

    <?php if ( has_post_thumbnail() ) : ?>
        <figure class="slide__bg">
            <?php the_post_thumbnail( 'arkimedia-hero', [ 'alt' => '' ] ); ?>
            <?php if ( $overlay ) : ?>
                <div class="slide__overlay" style="background:<?php echo esc_attr( $overlay ); ?>"></div>
            <?php endif; ?>
        </figure>
    <?php endif; ?>

    <div class="slide__content">
        <?php if ( $subtitle ) : ?>
            <p class="slide__eyebrow"><?php echo esc_html( $subtitle ); ?></p>
        <?php endif; ?>

        <h2 class="slide__title"><?php the_title(); ?></h2>

        <?php if ( $text ) : ?>
            <p class="slide__text"><?php echo esc_html( $text ); ?></p>
        <?php endif; ?>

        <?php if ( $link_url && $link_lbl ) : ?>
            <a class="slide__cta btn" href="<?php echo esc_url( $link_url ); ?>">
                <?php echo esc_html( $link_lbl ); ?>
            </a>
        <?php endif; ?>
    </div>

</div>
