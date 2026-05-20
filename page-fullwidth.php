<?php
/**
 * Template Name: Full Width
 * Template Post Type: page
 *
 * Pagina senza sidebar, layout a tutta larghezza.
 *
 * @package Arkimedia
 */

get_header();
?>

<main id="main" class="site-main site-main--fullwidth">

    <?php while ( have_posts() ) : the_post(); ?>

        <article id="post-<?php the_ID(); ?>" <?php post_class( 'entry entry--fullwidth' ); ?>>

            <?php if ( has_post_thumbnail() ) : ?>
                <div class="entry__cover">
                    <?php the_post_thumbnail( 'arkimedia-hero' ); ?>
                </div>
            <?php endif; ?>

            <div class="entry__body container">

                <header class="entry__header">
                    <h1 class="entry__title"><?php the_title(); ?></h1>
                </header>

                <div class="entry__content">
                    <?php the_content(); ?>
                </div>

            </div>

        </article>

    <?php endwhile; ?>

</main>

<?php get_footer(); ?>
