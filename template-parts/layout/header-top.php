<?php
/**
 * Template part: top bar header.
 *
 * @package Arkimedia
 */
?>
<div class="header__top">
    <div class="container">
        <?php
        $custom_logo_id = get_theme_mod( 'custom_logo' );
        if ( $custom_logo_id ) :
            echo wp_get_attachment_image( $custom_logo_id, 'full', false, [ 'class' => 'header__logo' ] );
        else :
        ?>
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="header__site-name">
                <?php bloginfo( 'name' ); ?>
            </a>
        <?php endif; ?>
    </div>
</div>
