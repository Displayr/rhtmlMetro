#' Box
#'
#' Creates an html Div container box with multiple features.
#'
#' @param text character. Adding text to the box.
#' @param text.as.html logical. Whether to interpret \code{text} as raw html. Defaults to \code{FALSE}.
#' @param horizontal.align horizontal alignment of \code{text}. Possible values are c("left","center","right"). Ellipse defaults to \code{"center"}, Rectangle defaults to \code{"left"}.
#' @param vertical.align vertical alignment of \code{text}. Possible values are \code{c("top","middle","bottom")}. Ellipse defaults to \code{"middle"}, Rectangle defaults to \code{"top"}.
#' @param wrap.text logical. Whether text wrapping is enabled. Defaults to \code{TRUE}.
#' @param background.color HTML color string. Sets the background color of the box. Defaults to \code{"Transparent"}.
#' @param background.shape character. Specifies the shape of the background with options \code{"Rectangle", "Ellipse"}, and defaults to "Rectangle".
#' @param font.family HTML font family string. Sets the font family of \code{text}. Defaults to \code{"sans-serif"}.
#' @param font.size integer. Sets the font size of \code{text} in points. Defaults to 11 pt.
#' @param font.color HTML color string. Sets the font color of \code{text}. Defaults to \code{"black"}.
#' @param font.bold logical. Whether to bold \code{text}. Defaults to \code{FALSE}.
#' @param font.italic logical. Whether to have italic \code{text}. Defaults to \code{FALSE}.
#' @param font.underline logical. Whether to underline \code{text}. Defaults to \code{FALSE}.
#' @param font.strikethrough logical. Whether to draw a horizontal line across \code{text}. Defaults to code{FALSE}.
#' @param border.width integer. Sets the border width in pixels. Defaults to 0.
#' @param border.color HTML color string. Sets the border color. Defaults to "Transparent".
#' @param border.style HTML border style string. Sets border style. Defaults to "Solid".
#' @param width integer. Width of the widget in pixels. Defaults to NULL, which automatically calculates the width based on window size.
#' @param height integer. Height of the widget in pixels. Defaults to NULL, which automatically calculates the height based on window size.

#' @importFrom htmlwidgets createWidget
#' @export

Box <- function(
    text = " ",
    text.as.html = FALSE,
    horizontal.align = NULL,
    vertical.align = NULL,
    wrap.text = TRUE,
    background.color = "Transparent",
    background.shape = "Rectangle",
    font.family = "sans-serif",
    font.size = 11,
    font.color = "black",
    font.bold = FALSE,
    font.italic = FALSE,
    font.underline = FALSE,
    font.strikethrough = FALSE,
    border.width = 0,
    border.color = "Transparent",
    border.style = "Solid",
    width = NULL,
    height = NULL
) {

    if (background.shape == "Ellipse") {
        if (is.null(horizontal.align)) {
            horizontal.align = "center"
        }
        if (is.null(vertical.align)) {
            vertical.align = "middle"
        }
    } else {
        if (is.null(horizontal.align)) {
            horizontal.align = "left"
        }
        if (is.null(vertical.align)) {
            vertical.align = "top"
        }
    }

    payload <- list(
        text = text,
        as_html = text.as.html,
        horizontal_align = horizontal.align,
        vertical_align = vertical.align,
        wrap_text = wrap.text,
        background_color = background.color,
        background_shape = background.shape,
        font_family = font.family,
        font_size = font.size,
        font_color = font.color,
        font_bold = font.bold,
        font_italic = font.italic,
        font_underline = font.underline,
        font_strikethrough = font.strikethrough,
        border_width = border.width,
        border_color = border.color,
        border_style = border.style,
        class = "box",
        width = width,
        height = height
    )

    w <- htmlwidgets::createWidget(
        name = 'rhtmlMetro',
        payload,
        width = width,
        height = height,
        sizingPolicy = htmlwidgets::sizingPolicy(
            browser.padding = 0,
            viewer.padding = 0,
            browser.fill = TRUE,
            viewer.fill = TRUE
        ),
        package = 'rhtmlMetro'
    )
    # Adding this attribute allows the widget to be used without being embedded in an iframe
    # See DS-3109 and the related epic of RS-6897
    attr(w, "can-run-in-root-dom") <- TRUE
    w
}
