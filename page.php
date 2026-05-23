<?php
/**
 * Template pagina statica.
 *
 * @package Arkimedia
 */

get_header();
?>

<main id="main" class="site-main">
    <?php while ( have_posts() ) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class( 'entry' ); ?>>
            <?php the_content(); ?>
        </article>
    <?php endwhile; ?>
</main>

<?php get_footer(); ?>
