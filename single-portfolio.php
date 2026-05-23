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

        $client   = get_post_meta( get_the_ID(), 'portfolio_client',   true );
        $year     = get_post_meta( get_the_ID(), 'portfolio_year',     true );
        $role     = get_post_meta( get_the_ID(), 'portfolio_role',     true );
        $url      = get_post_meta( get_the_ID(), 'portfolio_url',      true );
        $duration = get_post_meta( get_the_ID(), 'portfolio_duration', true );
        $cats     = get_the_terms( get_the_ID(), 'portfolio_category' );
    ?>

        <article id="post-<?php the_ID(); ?>" <?php post_class( 'project' ); ?>>

            <?php if ( has_post_thumbnail() ) : ?>
                <div class="project__cover">
                    <?php the_post_thumbnail( 'arkimedia-hero' ); ?>
                </div>
            <?php endif; ?>

            <div class="project__body container">

                <div class="project__main">

                    <header class="project__header">
                        <?php if ( $cats && ! is_wp_error( $cats ) ) : ?>
                            <p class="project__cat">
                                <?php echo esc_html( implode( ', ', wp_list_pluck( $cats, 'name' ) ) ); ?>
                            </p>
                        <?php endif; ?>
                        <h1 class="project__title"><?php the_title(); ?></h1>
                        <?php if ( has_excerpt() ) : ?>
                            <p class="project__excerpt"><?php the_excerpt(); ?></p>
                        <?php endif; ?>
                    </header>

                    <div class="project__content">
                        <?php the_content(); ?>
                    </div>

                </div>

                <aside class="project__meta">
                    <dl class="project__details">
                        <?php if ( $client ) : ?>
                            <div class="project__detail">
                                <dt><?php esc_html_e( 'Cliente', 'arkimedia' ); ?></dt>
                                <dd><?php echo esc_html( $client ); ?></dd>
                            </div>
                        <?php endif; ?>
                        <?php if ( $year ) : ?>
                            <div class="project__detail">
                                <dt><?php esc_html_e( 'Anno', 'arkimedia' ); ?></dt>
                                <dd><?php echo esc_html( $year ); ?></dd>
                            </div>
                        <?php endif; ?>
                        <?php if ( $role ) : ?>
                            <div class="project__detail">
                                <dt><?php esc_html_e( 'Ruolo', 'arkimedia' ); ?></dt>
                                <dd><?php echo esc_html( $role ); ?></dd>
                            </div>
                        <?php endif; ?>
                        <?php if ( $duration ) : ?>
                            <div class="project__detail">
                                <dt><?php esc_html_e( 'Durata', 'arkimedia' ); ?></dt>
                                <dd><?php echo esc_html( $duration ); ?></dd>
                            </div>
                        <?php endif; ?>
                        <?php if ( $url ) : ?>
                            <div class="project__detail">
                                <dt><?php esc_html_e( 'Progetto', 'arkimedia' ); ?></dt>
                                <dd>
                                    <a href="<?php echo esc_url( $url ); ?>"
                                       target="_blank"
                                       rel="noopener noreferrer">
                                        <?php esc_html_e( 'Visita il sito', 'arkimedia' ); ?>
                                        <span aria-hidden="true"> ↗</span>
                                    </a>
                                </dd>
                            </div>
                        <?php endif; ?>
                    </dl>

                    <a href="<?php echo esc_url( get_post_type_archive_link( 'portfolio' ) ); ?>"
                       class="project__back">
                        ← <?php esc_html_e( 'Tutti i progetti', 'arkimedia' ); ?>
                    </a>
                </aside>

            </div>

        </article>

    <?php endwhile; ?>

</main>

<?php get_footer(); ?>
