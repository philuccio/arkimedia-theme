<?php
/**
 * Template archivio.
 *
 * @package Arkimedia
 */

get_header();
?>

<main id="main" class="site-main">
    <div class="container">
        <?php if ( have_posts() ) : ?>
            <div class="archive__grid">
                <?php while ( have_posts() ) : the_post(); ?>
                    <?php get_template_part( 'template-parts/content/content', get_post_type() ); ?>
                <?php endwhile; ?>
            </div>
            <?php the_posts_navigation(); ?>
        <?php else : ?>
            <?php get_template_part( 'template-parts/content/content', 'none' ); ?>
        <?php endif; ?>
    </div>
</main>

<?php get_footer(); ?>
