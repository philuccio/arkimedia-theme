<?php
/**
 * Template part: nessun contenuto trovato.
 *
 * @package Arkimedia
 */
?>
<section class="no-results">
    <header class="no-results__header">
        <h1 class="no-results__title"><?php esc_html_e( 'Nessun risultato', 'arkimedia' ); ?></h1>
    </header>
    <div class="no-results__content">
        <p><?php esc_html_e( 'Non è stato trovato nessun contenuto. Prova con la ricerca.', 'arkimedia' ); ?></p>
        <?php get_search_form(); ?>
    </div>
</section>
