<?php
/**
 * Template Name: Portfolio
 * Template Post Type: page
 *
 * @package Arkimedia
 */

get_header();

$portfolio_query = new WP_Query( [
    'post_type'      => post_type_exists( 'portfolio' ) ? 'portfolio' : 'post',
    'posts_per_page' => -1,
    'orderby'        => 'menu_order',
    'order'          => 'ASC',
] );

$taxonomy   = post_type_exists( 'portfolio' ) ? 'portfolio_category' : 'category';
$categories = get_terms( [ 'taxonomy' => $taxonomy, 'hide_empty' => true ] );
?>

<main id="main" class="site-main site-main--portfolio">

    <?php if ( ! empty( $categories ) && ! is_wp_error( $categories ) ) : ?>
        <nav class="portfolio-filter container" aria-label="<?php esc_attr_e( 'Filtra per categoria', 'arkimedia' ); ?>">
            <button class="portfolio-filter__btn is-active" data-filter="*">
                <?php esc_html_e( 'Tutti', 'arkimedia' ); ?>
            </button>
            <?php foreach ( $categories as $cat ) : ?>
                <button class="portfolio-filter__btn" data-filter="<?php echo esc_attr( $cat->slug ); ?>">
                    <?php echo esc_html( $cat->name ); ?>
                </button>
            <?php endforeach; ?>
        </nav>
    <?php endif; ?>

    <?php if ( $portfolio_query->have_posts() ) : ?>
        <div class="portfolio-grid container">
            <?php while ( $portfolio_query->have_posts() ) : $portfolio_query->the_post();
                $cats      = get_the_terms( get_the_ID(), $taxonomy );
                $cat_slugs = $cats ? implode( ' ', wp_list_pluck( $cats, 'slug' ) ) : '';
            ?>
                <article class="portfolio-item <?php echo esc_attr( $cat_slugs ); ?>"
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
