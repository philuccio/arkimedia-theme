<?php
/**
 * Header del tema.
 *
 * @package Arkimedia
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div id="page" class="site">

    <!-- Menu fullscreen overlay -->
    <div id="ark-menu-overlay" class="ark-menu" aria-hidden="true">
        <div class="ark-menu__inner">

            <!-- Tasto chiusura -->
            <button class="ark-menu__close" id="ark-menu-close"
                    aria-label="<?php esc_attr_e( 'Chiudi menu', 'arkimedia' ); ?>">
                <span class="ark-menu__close-line ark-menu__close-line--1"></span>
                <span class="ark-menu__close-line ark-menu__close-line--2"></span>
            </button>

            <!-- Voci menu -->
            <nav class="ark-menu__nav" aria-label="<?php esc_attr_e( 'Menu principale', 'arkimedia' ); ?>">
                <?php
                wp_nav_menu( [
                    'theme_location' => 'primary',
                    'menu_id'        => 'ark-fullscreen-menu',
                    'menu_class'     => 'ark-menu__list',
                    'container'      => false,
                    'fallback_cb'    => false,
                ] );
                ?>
            </nav>

            <!-- Logo in basso a sinistra -->
            <?php
            $custom_logo_id = get_theme_mod( 'custom_logo' );
            if ( $custom_logo_id ) :
            ?>
                <div class="ark-menu__logo">
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>">
                        <?php echo wp_get_attachment_image( $custom_logo_id, 'full', false, [ 'class' => 'ark-menu__logo-img' ] ); ?>
                    </a>
                </div>
            <?php endif; ?>

            <!-- Menu secondario in basso a destra -->
            <div class="ark-menu__footer">
                <?php
                wp_nav_menu( [
                    'theme_location' => 'footer',
                    'menu_class'     => 'ark-menu__secondary',
                    'container'      => false,
                    'depth'          => 1,
                    'fallback_cb'    => false,
                ] );
                ?>
            </div>

        </div>
    </div>

    <header id="masthead" class="site-header">
        <div class="container site-header__inner">

            <!-- Logo -->
            <div class="site-header__logo">
                <?php
                if ( $custom_logo_id ) :
                ?>
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="header__logo-link">
                        <?php echo wp_get_attachment_image( $custom_logo_id, 'full', false, [ 'class' => 'header__logo' ] ); ?>
                    </a>
                <?php else : ?>
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="header__site-name">
                        <?php bloginfo( 'name' ); ?>
                    </a>
                <?php endif; ?>
            </div>

            <!-- Desktop nav -->
            <nav id="site-navigation" class="main-navigation" aria-label="<?php esc_attr_e( 'Menu principale', 'arkimedia' ); ?>">
                <?php
                wp_nav_menu( [
                    'theme_location' => 'primary',
                    'menu_id'        => 'primary-menu',
                    'menu_class'     => 'nav__list',
                    'container'      => false,
                    'fallback_cb'    => false,
                ] );
                ?>
            </nav>

            <!-- Hamburger -->
            <button class="ark-hamburger" id="ark-hamburger"
                    aria-controls="ark-menu-overlay"
                    aria-expanded="false"
                    aria-label="<?php esc_attr_e( 'Apri menu', 'arkimedia' ); ?>">
                <span class="ark-hamburger__line ark-hamburger__line--top"></span>
                <span class="ark-hamburger__line ark-hamburger__line--mid"></span>
                <span class="ark-hamburger__line ark-hamburger__line--bot"></span>
            </button>

        </div>
    </header>

    <div id="content" class="site-content">
