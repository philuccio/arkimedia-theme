<?php
/**
 * Template 404.
 *
 * @package Arkimedia
 */

get_header();
?>

<main id="main" class="site-main">
    <div class="container">
        <section class="error-404">
            <header class="error-404__header">
                <h1 class="error-404__title"><?php esc_html_e( 'Pagina non trovata', 'arkimedia' ); ?></h1>
            </header>
            <div class="error-404__content">
                <p><?php esc_html_e( 'La pagina che cerchi non esiste o è stata spostata.', 'arkimedia' ); ?></p>
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn">
                    <?php esc_html_e( 'Torna alla home', 'arkimedia' ); ?>
                </a>
            </div>
        </section>
    </div>
</main>

<?php
get_footer();
