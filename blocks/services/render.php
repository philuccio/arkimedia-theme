<?php
/**
 * Render blocco Services.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$eyebrow      = $attributes['eyebrow']         ?? 'SERVICES';
$title        = $attributes['title']           ?? 'OUT OF HOME';
$marquee      = $attributes['marqueeText']     ?? '';
$marquee_size = $attributes['marqueeFontSize'] ?? 13;
$marquee_speed = $attributes['marqueeSpeed']   ?? 100;
$marquee_sep  = $attributes['marqueeSeparator'] ?? '•';
$marquee_font = $attributes['marqueeFontFamily'] ?? '';
$marquee_sep_size = $attributes['marqueeSeparatorSize'] ?? '1em';
$marquee_color    = $attributes['marqueeColor']          ?? '';
$marquee_sep_color = $attributes['marqueeSeparatorColor'] ?? '';

// Classi del marquee condivise con l'anteprima dell'editor
$marquee_class = 'ark-services__marquee-wrap';
if ( $marquee_color || $marquee_sep_color )          $marquee_class .= ' ark-services__marquee-wrap--color';
if ( ! ( $attributes['marqueeBorderTop'] ?? true ) )    $marquee_class .= ' ark-services__marquee-wrap--no-top';
if ( ! ( $attributes['marqueeBorderBottom'] ?? true ) ) $marquee_class .= ' ark-services__marquee-wrap--no-bottom';
$title_size   = $attributes['titleSize']       ?? 'clamp(3rem,8vw,7rem)';
$card_t_size  = $attributes['cardTitleSize']   ?? '1.25rem';
$card_x_size  = $attributes['cardTextSize']    ?? '0.9375rem';
$cards        = $attributes['cards']           ?? [];
$bg_color     = $attributes['bgColor']         ?? '#0a0a0a';
$text_color   = $attributes['textColor']       ?? '#ffffff';
$accent       = $attributes['accentColor']     ?? '';

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'ark-services alignfull',
    'style' => "background:{$bg_color};color:{$text_color};width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);",
]);
?>

<section <?php echo $wrapper_attrs; ?>>

    <!-- Header -->
    <div class="ark-services__header">
        <?php if ( $eyebrow ) : ?>
            <p class="ark-services__eyebrow"<?php if ( $accent ) : ?> style="color:<?php echo esc_attr( $accent ); ?>"<?php endif; ?>>
                <?php echo esc_html( $eyebrow ); ?>
            </p>
        <?php endif; ?>
        <?php if ( $title ) : ?>
            <h2 class="ark-services__title" style="font-size:<?php echo esc_attr( $title_size ); ?>;"><?php echo esc_html( $title ); ?></h2>
        <?php endif; ?>
    </div>

    <!-- Marquee -->
    <?php if ( $marquee ) : ?>
        <div class="<?php echo esc_attr( $marquee_class ); ?>">
            <?php
            echo ark_render_marquee( $marquee, [
                'color'     => $marquee_color,
                'separator_color' => $marquee_sep_color,
                'font_size' => absint( $marquee_size ) . 'px',
                'speed'     => $marquee_speed,
                'separator' => $marquee_sep,
                'font'      => $marquee_font,
                'separator_size' => $marquee_sep_size,
            ] );
            ?>
        </div>
    <?php endif; ?>

    <!-- Cards -->
    <?php if ( ! empty( $cards ) ) : ?>
        <div class="ark-services__grid">
            <?php foreach ( $cards as $card ) :
                $card_title = $card['title']    ?? '';
                $card_text  = $card['text']     ?? '';
                $card_media = $card['mediaUrl'] ?? '';
                $card_alt   = $card['mediaAlt'] ?? '';
                $card_link  = esc_url( $card['link'] ?? '' );
                $card_blank = ! empty( $card['linkNewTab'] );
                $inner_tag  = $card_link ? 'a' : 'div';

                // L'ID dà srcset e dimensioni; i blocchi già salvati hanno solo l'URL
                $card_id    = $card['mediaId'] ?? 0;
                if ( ! $card_id && $card_media ) $card_id = attachment_url_to_postid( $card_media );
                $card_image = $card_id
                    ? wp_get_attachment_image( $card_id, 'large', false, [ 'alt' => $card_alt, 'loading' => 'lazy' ] )
                    : '';
            ?>
                <article class="ark-services__card" data-stagger-item>
                    <<?php echo $inner_tag; ?> class="ark-services__card-inner"<?php if ( $card_link ) : ?> href="<?php echo $card_link; ?>"<?php if ( $card_blank ) : ?> target="_blank" rel="noopener"<?php endif; ?><?php endif; ?>>
                        <?php if ( $card_image || $card_media ) : ?>
                            <figure class="ark-services__card-thumb">
                                <?php if ( $card_image ) : ?>
                                    <?php echo $card_image; ?>
                                <?php else : ?>
                                    <img src="<?php echo esc_url( $card_media ); ?>"
                                         alt="<?php echo esc_attr( $card_alt ); ?>"
                                         loading="lazy">
                                <?php endif; ?>
                            </figure>
                        <?php else : ?>
                            <div class="ark-services__card-thumb ark-services__card-thumb--empty"></div>
                        <?php endif; ?>
                        <div class="ark-services__card-body">
                            <?php if ( $card_title ) : ?>
                                <h3 class="ark-services__card-title" style="font-size:<?php echo esc_attr( $card_t_size ); ?>;"><?php echo esc_html( $card_title ); ?></h3>
                            <?php endif; ?>
                            <?php if ( $card_text ) : ?>
                                <p class="ark-services__card-text" style="font-size:<?php echo esc_attr( $card_x_size ); ?>;"><?php echo esc_html( $card_text ); ?></p>
                            <?php endif; ?>
                        </div>
                    </<?php echo $inner_tag; ?>>
                </article>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

</section>
