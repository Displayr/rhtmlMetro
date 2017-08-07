#' Box
#'
#' Creates a Box
#'

#' @import htmlwidgets
#' @export

Box <- function(
    text = NULL,
    horizontal_align = "left",
    vertical_align = "top",
    wrap_text = FALSE,
    background_color = "Transparent",
    font_family = "sans-serif",
    font_size = 11,
    font_bold = FALSE,
    font_italic = FALSE,
    font_underline = FALSE,
    font_strikethrough = FALSE,
    border_width = 0,
    border_color = "Transparent",
    border_style = "Solid",
    width = NULL,
    height = NULL
) {
    
    payload <- list(
        text = text,
        horizontal_align = horizontal_align,
        vertical_align = vertical_align,
        wrap_text = wrap_text,
        background_color = background_color,
        font_family = font_family,
        font_size = font_size,
        font_bold = font_bold,
        font_italic = font_italic,
        font_underline = font_underline,
        font_strikethrough = font_strikethrough,
        border_width = border_width,
        border_color = border_color,
        border_style = border_style,
        class = "box",
        width = width,
        height = height
    )

    htmlwidgets::createWidget(
        name = 'rhtmlMetro',
        payload,
        width = width,
        height = height,
        sizingPolicy = htmlwidgets::sizingPolicy(
            browser.padding = 5,
            viewer.padding = 5,
            browser.fill = TRUE,
            viewer.fill = TRUE
        ),
        package = 'rhtmlMetro'
    )
}



