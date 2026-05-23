<?php
/**
 * Render blocco Services.
 *
 * @package Arkimedia
 */

$eyebrow      = $attributes['eyebrow']         ?? 'SERVICES';
$title        = $attributes['title']           ?? 'OUT OF HOME';
$marquee      = $attributes['marqueeText']     ?? '';
$marquee_size = $attributes['marqueeFontSize'] ?? 13;
$cards        = $attributes['cards']           ?? [];
$bg_color     = $attributes['bgColor']         ?? '#0a0a0a';
$text_color   = $attributes['textColor']       ?? '#ffffff';
$accent       = $attributes['accentColor']     ?? '#e94560';

$wrapper_attrs = get_block_wrapper_attributes([
    'class' => 'ark-services alignfull',
    'style' => "background:{$bg_color};color:{$text_color};width:100vw;max-width:100vw;margin-left:calc(50% - 50vw);margin-right:calc(50% - 50vw);",
]);
?>

<section <?php echo $wrapper_attrs; ?>>

    <!-- Header -->
    <div class="ark-services__header">
        <?php if ( $eyebrow ) : ?>
            <p class="ark-services__eyebrow" style="color:<?php echo esc_attr( $accent ); ?>">
                <?php echo esc_html( $eyebrow ); ?>
            </p>
        <?php endif; ?>
        <?php if ( $title ) : ?>
            <h2 class="ark-services__title"><?php echo esc_html( $title ); ?></h2>
        <?php endif; ?>
    </div>

    <!-- Marquee -->
    <?php if ( $marquee ) : ?>
        <div class="ark-services__marquee-wrap">
            <div class="ark-services__marquee">
                <span class="ark-services__marquee-inner"
                      style="font-size:<?php echo absint( $marquee_size ); ?>px;">
                    <?php echo esc_html( $marquee ); ?>&nbsp;&nbsp;
                    <?php echo esc_html( $marquee ); ?>&nbsp;&nbsp;
                </span>
            </div>
        </div>
    <?php endif; ?>

    <!-- Cards -->
    <?php if ( ! empty( $cards ) ) : ?>
        <div class="ark-services__grid container">
            <?php foreach ( $cards as $card ) :
                $card_title = $card['title']    ?? '';
                $card_text  = $card['text']     ?? '';
                $card_media = $card['mediaUrl'] ?? '';
                $card_alt   = $card['mediaAlt'] ?? '';
            ?>
                <article class="ark-services__card">
                    <?php if ( $card_media ) : ?>
                        <figure class="ark-services__card-thumb">
                            <img src="<?php echo esc_url( $card_media ); ?>"
                                 alt="<?php echo esc_attr( $card_alt ); ?>"
                                 loading="lazy">
                        </figure>
                    <?php else : ?>
                        <div class="ark-services__card-thumb ark-services__card-thumb--empty"></div>
                    <?php endif; ?>
                    <div class="ark-services__card-body">
                        <?php if ( $card_title ) : ?>
                            <h3 class="ark-services__card-title"><?php echo esc_html( $card_title ); ?></h3>
                        <?php endif; ?>
                        <?php if ( $card_text ) : ?>
                            <p class="ark-services__card-text"><?php echo esc_html( $card_text ); ?></p>
                        <?php endif; ?>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

</section>
