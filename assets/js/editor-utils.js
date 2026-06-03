/**
 * Utility hooks per l'editor Gutenberg — Arkimedia Theme
 * Risolvono il problema del TextControl che perde il focus a ogni keystroke
 */
import { useState, useEffect, useCallback } from '@wordpress/element'

/**
 * Hook per TextControl — usa stato locale e aggiorna gli attributi solo onBlur
 * Evita il re-render del blocco a ogni tasto
 */
export function useLocalText( value, onChange ) {
    const [ local, setLocal ] = useState( value ?? '' )

    // Sincronizza se il valore esterno cambia (es. undo/redo)
    useEffect( () => {
        setLocal( value ?? '' )
    }, [ value ] )

    return {
        value:    local,
        onChange: setLocal,
        onBlur:   useCallback( () => onChange( local ), [ local, onChange ] ),
    }
}
