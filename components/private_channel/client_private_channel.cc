/* Copyright 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include <iostream>

#include "brave/components/private_channel/utils.h"
#include "brave/components/private_channel/client_private_channel.h"
#include "brave/components/private_channel/rust/ffi/src/private_channel.hpp"

  ChallengeArtefacts::ChallengeArtefacts() {}
  ChallengeArtefacts::ChallengeArtefacts(const ChallengeArtefacts& other)
    = default;
  ChallengeArtefacts::~ChallengeArtefacts() {}

  SecondRoundArtefacts::SecondRoundArtefacts() {}
  SecondRoundArtefacts::SecondRoundArtefacts(const SecondRoundArtefacts& other)
    = default;
  SecondRoundArtefacts::~SecondRoundArtefacts() {}

  ChallengeArtefacts ChallengeFirstRound(
    const char** input, int input_size, const uint8_t* server_pk) {

  struct ChallengeArtefacts artefacts;
  auto results = private_channel::start_challenge(input, input_size, server_pk);

  uint key_size = results.key_size;
  artefacts.client_pk = convert_to_str(results.pkey_ptr, key_size);
  artefacts.client_sk = convert_to_str(results.skey_ptr, key_size);
  artefacts.shared_pubkey = convert_to_str(results.shared_pubkey_ptr, key_size);
  artefacts.encrypted_hashes = convert_to_str(
    results.encrypted_hashes_ptr, results.encrypted_hashes_size);
  artefacts.error = results.error;

  private_channel::free_pointer_u8(results.pkey_ptr);
  private_channel::free_pointer_u8(results.skey_ptr);
  private_channel::free_pointer_u8(results.shared_pubkey_ptr);
  private_channel::free_pointer_u8(results.encrypted_hashes_ptr);

  return artefacts;
  }

  SecondRoundArtefacts SecondRound(
    const char* enc_input, int size, const char* client_sk) {

  uint kInputSize = get_size_response(enc_input);
  uint8_t enc_buffer[kInputSize];
  parse_str_response(enc_input, enc_buffer);

  uint kClientSkSize = get_size_response(client_sk);
  uint8_t sk_buffer[kClientSkSize];
  parse_str_response(client_sk, sk_buffer);

  struct SecondRoundArtefacts artefacts;
  auto results =
    private_channel::second_round(enc_buffer, kInputSize, sk_buffer);

  artefacts.partial_decryption = convert_to_str(
    results.encoded_partial_dec_ptr, results.encoded_partial_dec_size);
  artefacts.proofs = convert_to_str(
    results.encoded_proofs_ptr, results.encoded_proofs_size);
  artefacts.rand_vec = convert_to_str(
    results.random_vec_ptr, results.random_vec_size);
  artefacts.error = results.error;

  private_channel::free_pointer_u8(results.encoded_partial_dec_ptr);
  private_channel::free_pointer_u8(results.encoded_proofs_ptr);
  private_channel::free_pointer_u8(results.random_vec_ptr);

  return artefacts;
  }
