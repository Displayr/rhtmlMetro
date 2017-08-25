#' Box
#'
#' Creates an html Div container box with multiple features.
#' 
#' @param text character. Adding text to the box.
#' @param horizontal_align horizontal alignment of \code{text}. Possible values are c("left","center","right"). Defaults to \code{"left"}.
#' @param vertical_align vertical alignment of \code{text}. Possible values are \code{c("top","middle","bottom")}. Defaults to \code{"top"}.
#' @param wrap_text logical. Whether text wrapping is enabled. Defaults to \code{TRUE}.
#' @param background_color HTML color string. Sets the background color of the box. Defaults to \code{"Transparent"}.
#' @param font_family HTML font family string. Sets the font family of \code{text}. Defaults to \code{"sans-serif"}.
#' @param font_size integer. Sets the font size of \code{text} in pixels. Defaults to 11.
#' @param font_color HTML color string. Sets the font color of \code{text}. Defaults to \code{"black"}.
#' @param font_bold logical. Whether to bold \code{text}. Defaults to \code{FALSE}.
#' @param font_italic logical. Whether to have italic \code{text}. Defaults to \code{FALSE}.
#' @param font_underline logical. Whether to underline \code{text}. Defaults to \code{FALSE}.
#' @param font_strikethrough logical. Whether to draw a horizontal line across \code{text}. Defaults to code{FALSE}.
#' @param border_width integer. Sets the border width in pixels. Defaults to 0.
#' @param border_color HTML color string. Sets the border color. Defaults to "Transparent".
#' @param border_style HTML border style string. Sets border style. Defaults to "Solid".
#' @param as_html logical. Whether to interpret \code{text} as raw html. Defaults to \code{FALSE}.
#' @param width integer. Width of the widget in pixels. Defaults to NULL, which automatically calculates the width based on window size.
#' @param height integer. Height of the widget in pixels. Defaults to NULL, which automatically calculates the height based on window size.

#' @import htmlwidgets
#' @export

Box <- function(
    text = NULL,
    horizontal_align = "left",
    vertical_align = "top",
    wrap_text = TRUE,
    background_color = "Transparent",
    font_family = "sans-serif",
    font_size = 11,
    font_color = "black",
    font_bold = FALSE,
    font_italic = FALSE,
    font_underline = FALSE,
    font_strikethrough = FALSE,
    border_width = 0,
    border_color = "Transparent",
    border_style = "Solid",
    as_html = FALSE,
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
        font_color = font_color,
        font_bold = font_bold,
        font_italic = font_italic,
        font_underline = font_underline,
        font_strikethrough = font_strikethrough,
        border_width = border_width,
        border_color = border_color,
        border_style = border_style,
        as_html = as_html,
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



