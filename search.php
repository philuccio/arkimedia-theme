<?php
/**
 * Template risultati ricerca.
 *
 * @package Arkimedia
 */

get_header();
?>

<main id="main" class="site-main">
    <div class="container">

        <?php if ( have_posts() ) : ?>
            <header class="search__header">
                <h1 class="search__title">
                    <?php
                    printf(
                        esc_html__( 'Risultati per: %s', 'arkimedia' ),
                        '<span>' . esc_html( get_search_query() ) . '</span>'
                    );
                    ?>
                </h1>
            </header>

            <div class="search__results">
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

<?php
get_footer();
