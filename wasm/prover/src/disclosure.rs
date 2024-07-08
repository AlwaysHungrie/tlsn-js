use std::ops::Range;

/// Find the ranges of the public and private parts of a sequence.
///
/// Returns a tuple of `(public, private)` ranges.
pub fn find_ranges(seq: &[u8], private_seq: &[&[u8]]) -> (Vec<Range<usize>>, Vec<Range<usize>>) {
    let mut private_ranges = Vec::new();
    for s in private_seq {
        for (idx, w) in seq.windows(s.len()).enumerate() {
            if w == *s {
                private_ranges.push(idx..(idx + w.len()));
            }
        }
    }

    let mut sorted_ranges = private_ranges.clone();
    sorted_ranges.sort_by_key(|r| r.start);

    let mut public_ranges = Vec::new();
    let mut last_end = 0;
    for r in sorted_ranges {
        if r.start > last_end {
            public_ranges.push(last_end..r.start);
        }
        last_end = r.end;
    }

    if last_end < seq.len() {
        public_ranges.push(last_end..seq.len());
    }

    (public_ranges, private_ranges)
}

pub fn find_start_index(seq: &[u8], pattern: &[u8], delimiter: &[u8]) -> (usize, usize) {
    let index = seq
        .windows(pattern.len())
        .position(|window| window == pattern);

    match index {
        Some(index) => {
            let end = seq[index..]
                .iter()
                .position(|&c| c == delimiter[0])
                .map(|pos| index + pos)
                .unwrap_or(seq.len());

            (index, end)
        }
        None => (0, seq.len()),
    }
}

pub fn find_ranges_from_index(seq: &[u8], pattern: String, delimiter: String) -> Vec<Range<usize>> {
    let pattern = pattern.as_bytes();
    let delimiter = delimiter.as_bytes();
    let (start_index, end_index) = find_start_index(seq, pattern, delimiter);
    vec![start_index..end_index + 1]
}

pub fn find_ranges_from_pattern(seq: &[u8], pattern: &[u8], delimiter: &[u8]) -> Vec<Range<usize>> {
    let (start_index, end_index) = find_start_index(seq, pattern, delimiter);
    vec![start_index..end_index + 1]
}

/// Find the ranges of specific patterns in the sent and received byte sequences.
///
/// This function searches for specific patterns in the sent and received byte sequences and returns
/// the ranges of these patterns. If the host is "www.kaggle.com", it hides the entire sent and received
/// sequences.
///
/// # Arguments
/// * `sent` - A byte slice representing the sent data.
/// * `recv` - A byte slice representing the received data.
///
/// # Returns
/// A tuple containing two vectors of ranges. The first vector contains the ranges of the patterns
/// found in the sent data, and the second vector contains the ranges of the patterns found in the
/// received data.
///
/// # Examples
/// ```
/// let sent = b"GET / HTTP/1.1\r\nHost: example.com\r\n\r\n";
/// let recv = b"{\"id\": 12345, \"name\": \"test\"}";
/// let (sent_ranges, recv_ranges) = find_ranges_2(sent, recv);
/// assert_eq!(sent_ranges, vec![0..50]);
/// assert_eq!(recv_ranges, vec![8..14]);
/// ```
pub fn find_ranges_2(
    sent: &[u8],
    recv: &[u8],
    revealed_body: &[&[u8]],
) -> (Vec<Range<usize>>, Vec<Range<usize>>) {
    //@DEBUG: should have a reveal_header params
    //let range_host = find_ranges_from_index(sent, "host".to_string(), "\r".to_string());
    let range_field = find_ranges_from_pattern(recv, revealed_body[0], revealed_body[1]); // userId

    (vec![], range_field)
}

#[cfg(test)]
mod tests {
    use super::*;

    //#[test]
    // fn test_find_ranges_2() {
    //     let sent = b"GET / HTTP/1.1\r\nHost: example.com\r\n\r\n";
    //     let recv = b"{\"id\": 12345, \"name\": \"test\"}";

    //     let (sent_ranges, recv_ranges) = find_ranges_2(sent, recv);

    //     assert_eq!(sent_ranges, vec![0..50]);
    //     assert_eq!(recv_ranges, vec![8..14]);
    // }
}
