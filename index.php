<?php
/**
 * Template principale di fallback.
 *
 * @package Arkimedia
 */

get_header();
?>

<main id="main" class="site-main">
    <?php
    if ( have_posts() ) :
        while ( have_posts() ) :
            the_post();
            get_template_part( 'template-parts/content/content', get_post_type() );
        endwhile;
    else :
        get_template_part( 'template-parts/content/content', 'none' );
    endif;
    ?>
</main>

<?php
get_footer();
