<?php
/**
 * Render blocco Portfolio Meta.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$client    = $attributes['client']    ?? '';
$year      = $attributes['year']      ?? '';
$role      = $attributes['role']      ?? '';
$duration  = $attributes['duration']  ?? '';
$url       = $attributes['url']       ?? '';
$url_label = $attributes['urlLabel']  ?? 'Visita il sito';
$bg_color  = $attributes['bgColor']   ?? '';
$text_color= $attributes['textColor'] ?? '';
$show_back = $attributes['showBack']  ?? true;

$style = '';
if ( $bg_color )   $style .= "background:{$bg_color};";
if ( $text_color ) $style .= "color:{$text_color};";

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'ark-portfolio-meta',
    'style' => $style,
]);
?>

<aside <?php echo $wrapper_attrs; ?>>
    <dl class="ark-portfolio-meta__list">
        <?php if ( $client ) : ?>
            <div class="ark-portfolio-meta__item">
                <dt><?php esc_html_e( 'Cliente', 'arkimedia' ); ?></dt>
                <dd><?php echo esc_html( $client ); ?></dd>
            </div>
        <?php endif; ?>
        <?php if ( $year ) : ?>
            <div class="ark-portfolio-meta__item">
                <dt><?php esc_html_e( 'Anno', 'arkimedia' ); ?></dt>
                <dd><?php echo esc_html( $year ); ?></dd>
            </div>
        <?php endif; ?>
        <?php if ( $role ) : ?>
            <div class="ark-portfolio-meta__item">
                <dt><?php esc_html_e( 'Ruolo', 'arkimedia' ); ?></dt>
                <dd><?php echo esc_html( $role ); ?></dd>
            </div>
        <?php endif; ?>
        <?php if ( $duration ) : ?>
            <div class="ark-portfolio-meta__item">
                <dt><?php esc_html_e( 'Durata', 'arkimedia' ); ?></dt>
                <dd><?php echo esc_html( $duration ); ?></dd>
            </div>
        <?php endif; ?>
        <?php if ( $url ) : ?>
            <div class="ark-portfolio-meta__item">
                <dt><?php esc_html_e( 'Progetto', 'arkimedia' ); ?></dt>
                <dd>
                    <a href="<?php echo esc_url( $url ); ?>"
                       target="_blank" rel="noopener noreferrer">
                        <?php echo esc_html( $url_label ); ?>
                        <span aria-hidden="true"> ↗</span>
                    </a>
                </dd>
            </div>
        <?php endif; ?>
    </dl>

    <?php if ( $show_back ) : ?>
        <a href="<?php echo esc_url( get_post_type_archive_link( 'portfolio' ) ); ?>"
           class="ark-portfolio-meta__back">
            ← <?php esc_html_e( 'Tutti i progetti', 'arkimedia' ); ?>
        </a>
    <?php endif; ?>
</aside>
