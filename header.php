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
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">

    <header id="masthead" class="site-header">
        <?php get_template_part( 'template-parts/layout/header-top' ); ?>

        <div class="container">
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
                <button class="nav__toggle" aria-controls="primary-menu" aria-expanded="false">
                    <span class="nav__toggle-icon"></span>
                    <span class="screen-reader-text"><?php esc_html_e( 'Menu', 'arkimedia' ); ?></span>
                </button>
            </nav>
        </div>
    </header>

    <div id="content" class="site-content">
