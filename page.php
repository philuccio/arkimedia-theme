<?php
/**
 * Template pagina statica.
 *
 * @package Arkimedia
 */

get_header();
?>

<main id="main" class="site-main">
    <div class="container">
        <?php
        while ( have_posts() ) :
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class( 'entry' ); ?>>
                <div class="entry__content">
                    <?php the_content(); ?>
                </div>
            </article>
        <?php endwhile; ?>
    </div>
</main>

<?php get_footer(); ?>
