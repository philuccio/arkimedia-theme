<?php
/**
 * Template: Singolo progetto portfolio.
 *
 * @package Arkimedia
 */

get_header();
?>

<main id="main" class="site-main site-main--fullwidth">

    <?php while ( have_posts() ) : the_post();


    ?>

        <article id="post-<?php the_ID(); ?>" <?php post_class( 'project' ); ?>>

            <!-- Contenuto pagina (include blocco Testata se presente) -->
            <div class="project__content-full">
                <?php the_content(); ?>
            </div>



        </article>

    <?php endwhile; ?>

</main>

<?php get_footer(); ?>
