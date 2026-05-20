<?php
/**
 * Template Name: Landing Page
 * Template Post Type: page
 *
 * Pagina di conversione — nessun header, nessun footer.
 * Layout pulito, massima attenzione al contenuto.
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

<body <?php body_class( 'landing-page' ); ?>>
<?php wp_body_open(); ?>

<div id="page" class="landing-wrap">

    <main id="main" class="landing-main">

        <?php while ( have_posts() ) : the_post(); ?>

            <article id="post-<?php the_ID(); ?>" <?php post_class( 'landing-entry' ); ?>>
                <div class="landing-entry__content">
                    <?php the_content(); ?>
                </div>
            </article>

        <?php endwhile; ?>

    </main>

</div>

<?php wp_footer(); ?>
</body>
</html>
