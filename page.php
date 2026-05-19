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
            get_template_part( 'template-parts/content/content', 'page' );
        endwhile;
        ?>
    </div>
</main>

<?php
get_footer();
