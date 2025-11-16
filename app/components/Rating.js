import styled from "styled-components"
import StarIcon from "../icons/star_icon"

const StyledRating = styled.div`
    display: flex;
    align-items: center;
    gap: 2px;
`

function Rating({ rating, maxRating = 5 }) {
    return (
        <StyledRating>
            {Array.from({ length: maxRating }).map((_, index) => (
                <StarIcon
                    key={`full_star_${index}`}
                    filled={rating >= index + 1}
                />
            ))}
        </StyledRating>
    )
}

export default Rating
