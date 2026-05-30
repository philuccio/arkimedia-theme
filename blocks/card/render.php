<?php
/**
 * Render blocco Card.
 *
 * @package Arkimedia
 */

if ( ! defined( 'ABSPATH' ) ) exit;

$layout         = $attributes['layout']          ?? 'A';
$image_url      = $attributes['imageUrl']         ?? '';
$image_alt      = $attributes['imageAlt']         ?? '';
$object_fit     = $attributes['objectFit']        ?? 'cover';
$object_pos     = $attributes['objectPosition']   ?? 'center center';
$aspect_ratio   = $attributes['aspectRatio']      ?? '4/3';
$image_flex     = $attributes['imageFlex']        ?? '1';
$eyebrow        = $attributes['eyebrow']          ?? '';
$eyebrow_color  = $attributes['eyebrowColor']     ?? '#ffffff';
$eyebrow_bg     = $attributes['eyebrowBg']        ?? '';
$title          = $attributes['title']            ?? '';
$title_tag      = $attributes['titleTag']         ?? 'h3';
$title_color    = $attributes['titleColor']       ?? '#ffffff';
$title_size     = $attributes['titleSize']        ?? '1.5rem';
$title_weight   = $attributes['titleWeight']      ?? '700';
$title_lh       = $attributes['titleLineHeight']  ?? '1.2';
$description    = $attributes['description']      ?? '';
$desc_color     = $attributes['descColor']        ?? 'rgba(255,255,255,0.75)';
$desc_size      = $attributes['descSize']         ?? '0.9375rem';
$cta_label      = $attributes['ctaLabel']         ?? '';
$cta_url        = $attributes['ctaUrl']           ?? '';
$cta_style      = $attributes['ctaStyle']         ?? 'outline';
$cta_bg         = $attributes['ctaBgColor']       ?? '';
$cta_text       = $attributes['ctaTextColor']     ?? '#ffffff';
$link_url       = $attributes['linkUrl']          ?? '';
$link_target    = $attributes['linkTarget']       ?? '_self';
$bg_color       = $attributes['bgColor']          ?? '#1a1a2e';
$bg_type        = $attributes['bgType']           ?? 'color';
$grad_color1    = $attributes['gradientColor1']   ?? '#1a1a2e';
$grad_color2    = $attributes['gradientColor2']   ?? '#e94560';
$grad_angle     = $attributes['gradientAngle']    ?? 135;
$overlay        = $attributes['overlayColor']     ?? 'rgba(0,0,0,0.4)';
$content_pos    = $attributes['contentPosition']  ?? 'bottom-left';
$border_radius  = $attributes['borderRadius']     ?? 8;
$border_width   = $attributes['borderWidth']      ?? 0;
$border_color   = $attributes['borderColor']      ?? 'rgba(255,255,255,0.1)';
$hover          = $attributes['hoverEffect']      ?? 'zoom';
$pt             = $attributes['paddingTop']        ?? 24;
$pb             = $attributes['paddingBottom']     ?? 24;
$pl             = $attributes['paddingLeft']       ?? 24;
$pr             = $attributes['paddingRight']      ?? 24;
$mt             = $attributes['marginTop']         ?? 0;
$mb             = $attributes['marginBottom']      ?? 0;
$ml             = $attributes['marginLeft']        ?? 0;
$mr             = $attributes['marginRight']       ?? 0;
$anim_type      = $attributes['animationType']    ?? 'none';
$anim_delay     = $attributes['animationDelay']   ?? 0;
$card_height    = $attributes['cardHeight']        ?? '400px';
$use_aspect     = $attributes['useAspectRatio']    ?? true;

// Tag titolo
$allowed_tags = [ 'h2', 'h3', 'h4', 'h5', 'p', 'span' ];
$tag = in_array( $title_tag, $allowed_tags ) ? $title_tag : 'h3';

// Sfondo
switch ( $bg_type ) {
    case 'gradient':
        $bg_style = "background:linear-gradient({$grad_angle}deg,{$grad_color1},{$grad_color2});";
        break;
    default:
        $bg_style = "background:{$bg_color};";
        break;
}

// Posizione contenuto (Layout A)
$pos_map = [
    'bottom-left'   => [ 'justify-content' => 'flex-end',   'align-items' => 'flex-start', 'text-align' => 'left' ],
    'bottom-center' => [ 'justify-content' => 'flex-end',   'align-items' => 'center',     'text-align' => 'center' ],
    'bottom-right'  => [ 'justify-content' => 'flex-end',   'align-items' => 'flex-end',   'text-align' => 'right' ],
    'center-left'   => [ 'justify-content' => 'center',     'align-items' => 'flex-start', 'text-align' => 'left' ],
    'center-center' => [ 'justify-content' => 'center',     'align-items' => 'center',     'text-align' => 'center' ],
    'top-left'      => [ 'justify-content' => 'flex-start', 'align-items' => 'flex-start', 'text-align' => 'left' ],
];
$pos = $pos_map[ $content_pos ] ?? $pos_map['bottom-left'];

// CTA style
$cta_css = "display:inline-flex;align-items:center;gap:0.4rem;font-weight:600;font-size:0.875rem;text-decoration:none;transition:all 0.3s ease;margin-top:1rem;";
switch ( $cta_style ) {
    case 'filled':
        $cta_css .= "background:" . ( $cta_bg ?: 'var(--color-accent,#e94560)' ) . ";color:{$cta_text};padding:0.625rem 1.25rem;border-radius:4px;";
        break;
    case 'outline':
        $cta_css .= "border:1.5px solid currentColor;color:{$cta_text};padding:0.625rem 1.25rem;border-radius:4px;";
        break;
    case 'ghost':
        $cta_css .= "color:{$cta_text};border-bottom:1.5px solid currentColor;padding-bottom:2px;";
        break;
}

$block_id = 'ark-card-' . substr( md5( serialize( $attributes ) ), 0, 8 );

$wrapper_style = "border-radius:{$border_radius}px;overflow:hidden;position:relative;margin:{$mt}px {$mr}px {$mb}px {$ml}px;";
if ( $border_width ) $wrapper_style .= "border:{$border_width}px solid {$border_color};";

$wrapper_attrs = get_block_wrapper_attributes([
    'id'             => $block_id,
    'class'          => 'ark-card ark-card--' . esc_attr( strtolower( $layout ) ) . ' ark-card--hover-' . esc_attr( $hover ),
    'style'          => $wrapper_style,
    'data-animation' => $anim_type !== 'none' ? $anim_type : '',
    'data-delay'     => $anim_delay ? $anim_delay / 1000 : '',
]);

// Style tag per margin che il wrapper Gutenberg non sovrascrive
$margin_css = '';
if ( $mt || $mb || $ml || $mr ) {
    $margin_css = "<style>#{$block_id}.ark-card{margin:{$mt}px {$mr}px {$mb}px {$ml}px !important;}</style>";
}

// Helper: testo contenuto — closure per evitare redeclare su più istanze
$ark_card_text = function( $title, $tag, $title_size, $title_weight, $title_color, $title_lh, $eyebrow, $eyebrow_color, $eyebrow_bg, $description, $desc_color, $desc_size, $cta_label, $cta_url, $cta_css, $pt, $pr, $pb, $pl ) {
    ob_start();
    ?>
    <div class="ark-card__body" style="padding:<?php echo absint($pt); ?>px <?php echo absint($pr); ?>px <?php echo absint($pb); ?>px <?php echo absint($pl); ?>px;display:flex;flex-direction:column;">
        <?php if ( $eyebrow ) : ?>
            <p class="ark-card__eyebrow" style="color:<?php echo esc_attr($eyebrow_color); ?>;<?php echo $eyebrow_bg ? "background:{$eyebrow_bg};padding:0.2rem 0.6rem;border-radius:4px;display:inline-block;" : ''; ?>font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 0.75rem;">
                <?php echo esc_html( $eyebrow ); ?>
            </p>
        <?php endif; ?>
        <?php if ( $title ) : ?>
            <<?php echo esc_attr( $tag ); ?> class="ark-card__title" style="font-size:<?php echo esc_attr($title_size); ?>;font-weight:<?php echo esc_attr($title_weight); ?>;color:<?php echo esc_attr($title_color); ?>;line-height:<?php echo esc_attr($title_lh); ?>;margin:0 0 0.75rem;">
                <?php echo wp_kses_post( $title ); ?>
            </<?php echo esc_attr( $tag ); ?>>
        <?php endif; ?>
        <?php if ( $description ) : ?>
            <p class="ark-card__desc" style="font-size:<?php echo esc_attr($desc_size); ?>;color:<?php echo esc_attr($desc_color); ?>;line-height:1.6;margin:0;">
                <?php echo wp_kses_post( $description ); ?>
            </p>
        <?php endif; ?>
        <?php if ( $cta_label && $cta_url ) : ?>
            <a href="<?php echo esc_url( $cta_url ); ?>" class="ark-card__cta" style="<?php echo esc_attr( $cta_css ); ?>" onclick="event.stopPropagation();">
                <?php echo esc_html( $cta_label ); ?> →
            </a>
        <?php endif; ?>
    </div>
    <?php
    return ob_get_clean();
};
?>

<?php echo $margin_css; ?>
<div <?php echo $wrapper_attrs; ?>>

    <?php if ( $link_url ) : ?>
    <a href="<?php echo esc_url( $link_url ); ?>" class="ark-card__link" target="<?php echo esc_attr( $link_target ); ?>" <?php echo $link_target === '_blank' ? 'rel="noopener noreferrer"' : ''; ?>></a>
    <?php endif; ?>

    <?php
    // ── Layout A — Cover ──────────────────────────────────────────────────────
    if ( $layout === 'A' ) :
        $cover_size = $use_aspect
            ? "aspect-ratio:{$aspect_ratio};"
            : "height:{$card_height};";
    ?>
        <div class="ark-card__cover" style="<?php echo $cover_size; ?>position:relative;<?php echo $bg_style; ?>width:100%;">
            <?php if ( $image_url ) : ?>
                <img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $image_alt ); ?>" class="ark-card__img" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:<?php echo esc_attr( $object_fit ); ?>;object-position:<?php echo esc_attr( $object_pos ); ?>;transition:transform 0.5s ease;">
            <?php endif; ?>
            <div class="ark-card__overlay" style="position:absolute;inset:0;background:<?php echo esc_attr( $overlay ); ?>;z-index:1;"></div>
            <div class="ark-card__content" style="position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;justify-content:<?php echo esc_attr( $pos['justify-content'] ); ?>;align-items:<?php echo esc_attr( $pos['align-items'] ); ?>;text-align:<?php echo esc_attr( $pos['text-align'] ); ?>;padding:<?php echo absint($pt); ?>px <?php echo absint($pr); ?>px <?php echo absint($pb); ?>px <?php echo absint($pl); ?>px;">
                <?php if ( $eyebrow ) : ?>
                    <p class="ark-card__eyebrow" style="color:<?php echo esc_attr($eyebrow_color); ?>;font-size:0.75rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 0.5rem;">
                        <?php echo esc_html( $eyebrow ); ?>
                    </p>
                <?php endif; ?>
                <?php if ( $title ) : ?>
                    <<?php echo esc_attr( $tag ); ?> class="ark-card__title" style="font-size:<?php echo esc_attr($title_size); ?>;font-weight:<?php echo esc_attr($title_weight); ?>;color:<?php echo esc_attr($title_color); ?>;line-height:<?php echo esc_attr($title_lh); ?>;margin:0 0 0.5rem;">
                        <?php echo wp_kses_post( $title ); ?>
                    </<?php echo esc_attr( $tag ); ?>>
                <?php endif; ?>
                <?php if ( $description ) : ?>
                    <p class="ark-card__desc" style="font-size:<?php echo esc_attr($desc_size); ?>;color:<?php echo esc_attr($desc_color); ?>;line-height:1.5;margin:0;">
                        <?php echo wp_kses_post( $description ); ?>
                    </p>
                <?php endif; ?>
                <?php if ( $cta_label && $cta_url ) : ?>
                    <a href="<?php echo esc_url( $cta_url ); ?>" class="ark-card__cta" style="<?php echo esc_attr( $cta_css ); ?>" onclick="event.stopPropagation();">
                        <?php echo esc_html( $cta_label ); ?> →
                    </a>
                <?php endif; ?>
            </div>
        </div>

    <?php
    // ── Layout B — Immagine top + testo sotto ─────────────────────────────────
    elseif ( $layout === 'B' ) :
    ?>
        <?php $img_size = $use_aspect ? "aspect-ratio:{$aspect_ratio};" : "height:{$card_height};"; ?>
        <div class="ark-card__image-wrap" style="<?php echo $img_size; ?>position:relative;overflow:hidden;">
            <?php if ( $image_url ) : ?>
                <img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $image_alt ); ?>" class="ark-card__img" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:<?php echo esc_attr( $object_fit ); ?>;object-position:<?php echo esc_attr( $object_pos ); ?>;transition:transform 0.5s ease;">
            <?php else : ?>
                <div style="position:absolute;inset:0;<?php echo $bg_style; ?>"></div>
            <?php endif; ?>
        </div>
        <div style="<?php echo $bg_style; ?>">
            <?php echo $ark_card_text( $title, $tag, $title_size, $title_weight, $title_color, $title_lh, $eyebrow, $eyebrow_color, $eyebrow_bg, $description, $desc_color, $desc_size, $cta_label, $cta_url, $cta_css, $pt, $pr, $pb, $pl ); ?>
        </div>

    <?php
    // ── Layout C — Solo testo + sfondo ───────────────────────────────────────
    elseif ( $layout === 'C' ) :
    ?>
        <div style="<?php echo $bg_style; ?>height:100%;min-height:inherit;">
            <?php echo $ark_card_text( $title, $tag, $title_size, $title_weight, $title_color, $title_lh, $eyebrow, $eyebrow_color, $eyebrow_bg, $description, $desc_color, $desc_size, $cta_label, $cta_url, $cta_css, $pt, $pr, $pb, $pl ); ?>
        </div>

    <?php
    // ── Layout E — Orizzontale immagine sx + testo dx ─────────────────────────
    elseif ( $layout === 'E' ) :
    ?>
        <div style="display:flex;flex-direction:row;height:100%;<?php echo $bg_style; ?>">
            <?php if ( $image_url ) : ?>
                <div class="ark-card__image-wrap" style="flex:<?php echo esc_attr( $image_flex ); ?>;position:relative;overflow:hidden;min-height:200px;">
                    <img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $image_alt ); ?>" class="ark-card__img" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:<?php echo esc_attr( $object_fit ); ?>;object-position:<?php echo esc_attr( $object_pos ); ?>;transition:transform 0.5s ease;">
                </div>
            <?php endif; ?>
            <div style="flex:2;display:flex;align-items:center;">
                <?php echo $ark_card_text( $title, $tag, $title_size, $title_weight, $title_color, $title_lh, $eyebrow, $eyebrow_color, $eyebrow_bg, $description, $desc_color, $desc_size, $cta_label, $cta_url, $cta_css, $pt, $pr, $pb, $pl ); ?>
            </div>
        </div>

    <?php endif; ?>

</div>
