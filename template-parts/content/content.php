<?php
/**
 * Template part: contenuto post generico.
 *
 * @package Arkimedia
 */
?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'entry' ); ?>>

    <header class="entry__header">
        <?php if ( is_singular() ) : ?>
            <h1 class="entry__title"><?php the_title(); ?></h1>
        <?php else : ?>
            <h2 class="entry__title">
                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
            </h2>
        <?php endif; ?>
    </header>

    <?php if ( has_post_thumbnail() ) : ?>
        <div class="entry__thumbnail">
            <?php the_post_thumbnail( 'arkimedia-card' ); ?>
        </div>
    <?php endif; ?>

    <div class="entry__content">
        <?php
        if ( is_singular() ) :
            the_content();
        else :
            the_excerpt();
        endif;
        ?>
    </div>

</article>
