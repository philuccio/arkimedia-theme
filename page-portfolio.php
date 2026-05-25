<?php
/**
 * Template Name: Portfolio
 * Template Post Type: page
 *
 * @package Arkimedia
 */

get_header();

$portfolio_query = new WP_Query( [
    'post_type'      => 'portfolio',
    'posts_per_page' => -1,
    'orderby'        => 'menu_order',
    'order'          => 'ASC',
] );
?>

<main id="main" class="site-main site-main--portfolio">

    <?php if ( $portfolio_query->have_posts() ) : ?>
        <div class="portfolio-grid container">
            <?php while ( $portfolio_query->have_posts() ) : $portfolio_query->the_post();
                $cats      = get_the_terms( get_the_ID(), 'portfolio_category' );
                $cat_slugs = $cats ? implode( ' ', wp_list_pluck( $cats, 'slug' ) ) : '';
            ?>
                <article class="portfolio-item"
                         data-category="<?php echo esc_attr( $cat_slugs ); ?>">
                    <a href="<?php the_permalink(); ?>" class="portfolio-item__link">
                        <?php if ( has_post_thumbnail() ) : ?>
                            <figure class="portfolio-item__thumb">
                                <?php the_post_thumbnail( 'arkimedia-card' ); ?>
                                <div class="portfolio-item__overlay">
                                    <span class="portfolio-item__icon" aria-hidden="true">+</span>
                                </div>
                            </figure>
                        <?php endif; ?>
                        <div class="portfolio-item__info">
                            <h2 class="portfolio-item__title"><?php the_title(); ?></h2>
                            <?php if ( $cats ) : ?>
                                <p class="portfolio-item__cat">
                                    <?php echo esc_html( implode( ', ', wp_list_pluck( $cats, 'name' ) ) ); ?>
                                </p>
                            <?php endif; ?>
                        </div>
                    </a>
                </article>
            <?php endwhile; wp_reset_postdata(); ?>
        </div>
    <?php else : ?>
        <?php get_template_part( 'template-parts/content/content', 'none' ); ?>
    <?php endif; ?>

</main>

<?php get_footer(); ?>
